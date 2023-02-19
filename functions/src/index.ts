import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { parse } from "node-html-parser";


admin.initializeApp();
const db = admin.firestore();

exports.updatePackages = functions.pubsub
  .schedule("0 * * * *")
  .onRun(async () => {
    const elementsRef = db.collection("labels");
    const elementsSnapshot = await elementsRef.get();
    const elementsArray: admin.firestore.DocumentData[] = [];
    elementsSnapshot.forEach((doc) => {
      const element = doc.data();
      elementsArray.push(element);
    });

    for (let i = 0; i < elementsArray.length; i++) {
      try {
        if (elementsArray[i].carrier === "USPS") {
          const html = await fetch(
            `https://tools.usps.com/go/TrackConfirmAction.action?tLabels=${elementsArray[i].label}`
          );
          const parsed = parse(await html.text());
          const statusContainer = parsed.querySelector(
            ".tracking-progress-bar-status-container"
          );
          const steps = statusContainer?.querySelectorAll(".tb-step");
          const stepArr = [] as Array<{
            status?: string;
            location?: string;
            date?: string;
          }>;
          if (steps) {
            steps.forEach((step) => {
              const status = step.querySelector(".tb-status-detail")?.text;
              const loc = step.querySelector(".tb-location")?.text;
              const date = step.querySelector(".tb-date")?.text;
              const steph = {
                status: status ? status : "",
                location: loc ? loc : "",
                date: date ? date : "",
              };
              stepArr.push(steph);
            });
          }

          if (stepArr.length > 0) {
            for (let j = 0; j < stepArr.length; j++) {
              const currentElement = elementsArray[i].status[j];
              if (
                currentElement.status !== stepArr[j].status ||
                currentElement.location !== stepArr[j].location ||
                currentElement.date !== stepArr[j].date
              ) {
                elementsArray[i].ref.update({ status: stepArr });
                continue;
              }
            }
          }
        }
      } catch (err) {
        console.log("oh no something happen");
      }
    }
  });

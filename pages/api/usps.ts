import { labelsRef } from "@/utils/firebase"
import { addDoc } from "firebase/firestore"
import { NextApiRequest, NextApiResponse } from "next"
import { parse } from "node-html-parser"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const label = req.query.label
    const user = req.query.user
    const html = await fetch(`https://tools.usps.com/go/TrackConfirmAction.action?tLabels=${label}`)
    const parsed = parse(await html.text())
    const statusContainer = parsed.querySelector('.tracking-progress-bar-status-container')
    const steps = statusContainer?.querySelectorAll(".tb-step")
    const stepArr = [] as Array<{ status?: string, location?: string, date?: string }>
    if (steps) {
      steps.forEach(step => {
        const status = step.querySelector('.tb-status-detail')?.text
        const loc = step.querySelector('.tb-location')?.text
        const date = step.querySelector('.tb-date')?.text
        const steph = {
          status: status ? status : "",
          location: loc ? loc : "",
          date: date ? date : ""
        }
        stepArr.push(steph)
      });
    }
    if (user) {
      await addDoc(labelsRef, {
        label: label,
        created: new Date(Date.now()).toLocaleString(),
        rating: -1,
        status: stepArr,
        username: user,
        carrier: "USPS"
      })
    }
    console.log(steps)
    res.status(200).json({ label, latestKey: stepArr[0], carrier: "USPS"})
  } catch (err) {
    console.log(err)
  }
}

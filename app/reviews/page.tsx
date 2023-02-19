"use client"
import Head from 'next/head'
import Image from 'next/image'
import styles from './page.module.css'
import usps from "../../public/usps.png"
import ups from "../../public/ups.png"
import fedex from "../../public/FedEx.png"
import { getDocs, query, where } from 'firebase/firestore'
import { labelsRef } from '@/utils/firebase'
import { useEffect, useState } from 'react'

export default function Home() {

  const [tempUPS, setTempUPS] = useState<[number, string]>([0, '']);

  useEffect(() => {
    getReviews()
  }, [])

  async function getReviews() {
    const labelQuery = query(labelsRef, where('carrier', '==', "USPS"));
    const querySnapshot = await getDocs(labelQuery);
    const elementsArray: { rating: number; rev: string }[] = []
    querySnapshot.forEach(doc => {
      const rting = doc.data().rating;
      const rev = doc.data().review
      elementsArray.push({
        rating: rting,
        rev: rev ? rev : "No Review"
      });
    });
    const totalRating = elementsArray.reduce((acc, { rating }) => acc + rating, 0);
    const avgRating = totalRating / elementsArray.length;
    const docsWithReview = elementsArray.filter(element => element.rev !== 'No Review')

    setTempUPS([avgRating, docsWithReview[Math.floor(Math.random() * docsWithReview.length)].rev])
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.wrapper}>

          <div className={styles.carrier}>
            <div>
              <Image alt="USPS" src={usps} height={200} />
              <a href="https://nextjs.org/docs" className={styles.card}>
                <h2>Average Rating: {tempUPS[0]}/5</h2>
                <p>Featured Review: {tempUPS[1]}</p>
              </a>
            </div>
            <div>
              <Image alt="UPS" src={ups} height={200} />
              <a href="https://nextjs.org/learn" className={styles.card}>
                <h2>Rating TBD</h2>
                <p>This is a review about the UPS, why are the names UPS and USPS so similar?</p>
              </a>
            </div>
            <div>
              <Image alt="FedEx" src={fedex} height={200}/>
              <a href="https://nextjs.org/learn" className={styles.card}>
                <h2>Rating TBD</h2>
                <p>A random review about FedEx of the Express variety.</p>
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
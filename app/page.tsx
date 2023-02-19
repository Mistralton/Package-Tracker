"use client"
import Head from 'next/head'
import Image from 'next/image'
import styles from './page.module.css'
import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0/client';
import usps from "../public/usps.png"
import ups from "../public/ups.png"
import fedex from "../public/FedEx.png"
import { useState, ChangeEvent} from "react";
import Mapbox from './(components)/Mapbox';

export default function Home() {

  const { user, isLoading } = useUser();

  const [label, setLabel ] = useState<string>("");

  const [result, setResult] = useState({} as {label: string, latestKey: {date: string, location: string, status: string}, carrier: string})

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dogs = await fetch(`api/usps?label=${label}&${user ? `user=${user}` : ""}`);
    const json = await dogs.json();
    setResult(json);
  }

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.wrapper}>
        <h1 className={styles.title}>
          Package <span>Tracker</span>
        </h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input className={styles.input} placeholder="Enter your shipping label" onChange={handleLabelChange}/>
          <button type="submit" className={styles.submit} >Track Label</button>
        </form>

        {result && result.latestKey && <div>
          <div className={styles.response}>
            <p className={styles.tabledate} >{result.latestKey.date}</p>
            <p className={styles.tablestatus} >{result.latestKey.status}</p>
          </div>
          <Mapbox search={result.latestKey.location.trim()}/>
        </div>}

        <div className={styles.landing}>
          <h2>Track packages and review carrier performance in one place!</h2>
          <div className={styles.carrier}>
            <Image alt="USPS" src={usps} height={200} />
            <Image alt="UPS" src={ups} height={200} />
            <Image alt="FedEx" src={fedex} height={200}/>
          </div>
        </div>

        </div>
      </main>
    </div>
  )
}

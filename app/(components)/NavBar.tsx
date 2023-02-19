"use client"

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

import React from 'react'
import Link from "next/link";
import styles from './navbar.module.css'
const navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isLoading } = useUser();
    const toggle = () => setIsOpen(!isOpen);
  return (
    <nav className={styles.nav}>
        <div className={styles.navleft}>
          <Link href="/" >Home</Link>
          <Link href="/reviews" >Reviews</Link>
        </div>
        <div className={styles.navright}>
          <Link href="profile" >Profile</Link>
          {user && (
          <a href="/api/auth/logout">Logout</a>
          )}
          {!user && (
            <a href="/api/auth/login">Login</a>
          )}
        </div>
    </nav>
  )
}

export default navbar
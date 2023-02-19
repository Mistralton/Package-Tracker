import { labelsRef } from '@/utils/firebase';
import { getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import styles from './modal.module.css'


export default function Modal({ label, onHide }: { label: string, onHide: () => void }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleClick = (value: number) => {
    setRating(value);
  };

  async function writeReview() {
    const labelQuery = query(labelsRef, where('label', '==', label));
    const querySnapshot = await getDocs(labelQuery);
    const labelDoc = querySnapshot.docs[0].ref;

    await updateDoc(labelDoc, {
      rating: rating,
      review: reviewText,
    });

    onHide(); // hide modal after submitting review
  }


  return (
    <div className={styles.modal}>
      <h2>Your Rating</h2>
      <div>
        {[...Array(5)].map((star, index) => {
          const value = index + 1;
          const opacity = rating >= value ? 1 : 0.5; // set opacity based on rating
          return (
            <span key={index} onClick={() => handleClick(value)} style={{ opacity }}>
              ⭐
            </span>
          );
        })}
      </div>
      <input placeholder="What you thought" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
      <button onClick={() => {
        rating !== 0 && reviewText && writeReview()
      }}>Submit</button>
    </div>
  )
}
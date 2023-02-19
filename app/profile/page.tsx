"use client"
import { useUser } from '@auth0/nextjs-auth0/client';
import { Fragment, useEffect, useState } from 'react';
import { labelsRef } from "@/utils/firebase";
import { DocumentData, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import styles from './page.module.css'
import Mapbox from '../(components)/Mapbox';
import Modal from './Modal';

export default function profilepage() {
  const { user, error, isLoading } = useUser();

  const [expandedRows, setExpandedRows] = useState([] as number[]);
  const [expandedMap, setExpandedMap] = useState([] as number[]);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };
  const [reviewLabel, setReviewLabel] = useState("")

  const [labels, setLabels] = useState([] as Array<{ created: string, label: string, rating: number, status: [{date: string, location: string, status: string}], carrier: string, username: string }>)
  const [filtered, setFiltered] = useState([] as Array<{ created: string, label: string, rating: number, status: [{date: string, location: string, status: string}], carrier: string, username: string }>)
  useEffect(() => {
    async function getlabels() {
      const userLabels = [] as Array<DocumentData>
      if (user && user.email) {
        const labelQuery = query(labelsRef, where('username', '==', user.email));
        const findLabels = await getDocs(labelQuery);
        findLabels.forEach((link) => {
          userLabels.push(link.data());
        });
        setLabels(userLabels as Array<{ created: string, label: string, rating: number, status: [{date: string, location: string, status: string}], carrier: string, username: string }>)
      }
    }
    getlabels();

    // let unsubscribe: () => void;
    // if (user && user.email) {
    //   const updatedLabels = [] as Array<DocumentData>;
    //   const labelQuery = query(labelsRef, where('username', '==', user.email));
    //   unsubscribe = onSnapshot(labelQuery, (snapshot) => {
    //     snapshot.forEach((doc) => {
    //       updatedLabels.push(doc.data());
    //     });
    //   });
    //   setLabels(updatedLabels as Array<{ created: string, label: string, rating: number, status: [{date: string, location: string, status: string}], carrier: string, username: string }>);
    // }

    // return () => {
    //   unsubscribe && unsubscribe();
    // };
  }, [user]);

  const toggleRow = (rowIndex: number) => {
    setExpandedRows(prevState => {
      if (prevState.includes(rowIndex)) {
        return prevState.filter(index => index !== rowIndex);
      } else {
        return [...prevState, rowIndex];
      }
    });
  };

  const toggleMap = (rowIndex: number) => {
    setExpandedMap(prevState => {
      if (prevState.includes(rowIndex)) {
        return prevState.filter(index => index !== rowIndex);
      } else {
        return [...prevState, rowIndex];
      }
    });
  };
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const filter = (status: string) => {
    setFiltered(labels.filter(label => status !== 'All' ? label.status[0].status.includes(status) : labels))
  }

  return (
    <>
      {user && (
        <div className={styles.wrapper}>
          <div className={styles.filterbutton}>
            <p>Filter Status</p>
            <div>
              <p onClick={() => filter("All")}>All</p>
              <p onClick={() => filter("Delivered")}>Delivered</p>
              <p onClick={() => filter("Missing")}>Missing</p>
            </div>
          </div>
          {showModal && <Modal label={reviewLabel} onHide={handleHideModal} />}
          <table className={styles.table} cellPadding="10" cellSpacing="0">
            <thead className="p-4">
              <tr>
                <th>Created</th>
                <th>Label</th>
                <th>Carrier</th>
                <th>Status</th>
                <th className="w-2" />
              </tr>
            </thead>
            <tbody className="truncate gap-4">
            {filtered[0] ? filtered.map((label, index) => {
              const isExpanded = expandedRows.includes(index);
              return (
                <Fragment key={label.label}>
                  <tr className={`${styles.tablerow} ${
                      expandedRows.includes(index) ? styles.expanded : ''
                      }`} onClick={() => toggleRow(index)}>
                    <td>
                      <p>{label.created.substring(0, label.created.indexOf(','))}</p>
                    </td>
                    <td>
                      <p>{label.label}</p>
                    </td>
                    <td>
                      <p>{label.carrier}</p>
                    </td>
                    <td>
                      <p>{label.status[0].status}</p>
                    </td>
                    {label.status[0].status.includes("Delivered") &&
                      <td>
                        <button  onClick={(event) => {
                          event.stopPropagation()
                          handleShowModal()
                          setReviewLabel(label.label)
                        }} className={styles.review}> Review</button>
                      </td>
                    }
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td className={styles.nopadtd} colSpan={4}>
                        <div>
                          {label.status.map((status, statusIndex) => {
                            const isExpanded = expandedMap.includes(statusIndex);
                            return (
                              <Fragment key={status.status}>
                                <div className={styles.listDiv} key={statusIndex}
                                  onClick={() => toggleMap(statusIndex)}>
                                  <p className={styles.tabledate} >{status.date}</p>
                                  <p className={styles.tablestatus} >{status.status}</p>
                                </div>
                                { isExpanded && status.location.length > 0 && <Mapbox search={status.location.trim()}/> }
                              </Fragment>
                            )
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            }) : labels.map((label, index) => {
                const isExpanded = expandedRows.includes(index);
                return (
                  <Fragment key={label.label}>
                    <tr className={`${styles.tablerow} ${
                        expandedRows.includes(index) ? styles.expanded : ''
                        }`} onClick={() => toggleRow(index)}>
                      <td>
                        <p>{label.created.substring(0, label.created.indexOf(','))}</p>
                      </td>
                      <td>
                        <p>{label.label}</p>
                      </td>
                      <td>
                        <p>{label.carrier}</p>
                      </td>
                      <td>
                        <p>{label.status[0].status}</p>
                      </td>
                      {label.status[0].status.includes("Delivered") &&
                      <td>
                        <button  onClick={(event) => {
                          event.stopPropagation()
                          handleShowModal()
                          setReviewLabel(label.label)
                        }} className={styles.review}> Review</button>
                      </td>
                    }
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td className={styles.nopadtd} colSpan={4}>
                          <div>
                            {label.status.map((status, statusIndex) => {
                              const isExpanded = expandedMap.includes(statusIndex);
                              return (
                                <Fragment key={status.status}>
                                  <div className={styles.listDiv} key={statusIndex}
                                    onClick={() => toggleMap(statusIndex)}>
                                    <p className={styles.tabledate} >{status.date}</p>
                                    <p className={styles.tablestatus} >{status.status}</p>
                                  </div>
                                  { isExpanded && status.location.length > 0 && <Mapbox search={status.location.trim()}/> }
                                </Fragment>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
		      </table>
        </div>
      )}
      {!user && (
        <div>
          <h1>You Must Be Logged In</h1>
        </div>
      )}
    </>
  );
}
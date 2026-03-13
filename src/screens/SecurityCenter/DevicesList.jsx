import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function DevicesList({ user }) {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) setDevices(docSnap.data().devices || []);
    };
    fetchDevices();
  }, [user]);

  return (
    <div>
      <h3>Appareils connectés</h3>
      {devices.length === 0 ? (
        <p>Aucun appareil connecté</p>
      ) : (
        <ul>
          {devices.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
import { createContext, useState, useContext, useEffect } from 'react';
import { initialCars } from '../data/cars';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [cars, setCars] = useState(initialCars); // Fallback to mock data initially
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    // ONETIME FORCE SYNC: Delete old Firebase cars and push the new custom cars
    if (localStorage.getItem("force_sync_custom_cars_3") !== "true") {
      console.log("Forcing database wipe and rewrite...");
      getDocs(collection(db, "cars")).then((snap) => {
         snap.docs.forEach(async (d) => {
            await deleteDoc(doc(db, "cars", d.id)).catch(e => {});
         });
         initialCars.forEach(async (car) => {
            await setDoc(doc(db, "cars", car.id), car).catch(e => {});
         });
         localStorage.setItem("force_sync_custom_cars_3", "true");
      }).catch(err => {
         console.warn("Could not force sync custom cars (possibly due to Firestore permissions). Using local data.", err.message);
         // Mark as true anyway so it doesn't keep trying and failing
         localStorage.setItem("force_sync_custom_cars_3", "true");
      });
    }

    const unsubscribe = onSnapshot(collection(db, "cars"), (snapshot) => {
      const dbCars = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: data.id || d.id,
          ...data
        };
      });
      
      if (dbCars.length > 0) {
        setCars(dbCars.sort((a,b) => (b.isFeatured === a.isFeatured) ? 0 : b.isFeatured ? -1 : 1));
      } else {
         setCars(initialCars);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync Notifications securely when User changes
  useEffect(() => {
    if (!db || !user) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, "notifications"), 
      where("targetUserId", "==", user.uid)
    );

    const unsubscribeNotifs = onSnapshot(q, (snapshot) => {
      const dbNotifs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      // Sort manually since compound queries might require complex indexing
      dbNotifs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setNotifications(dbNotifs);
    }, (error) => {
      console.error("Firestore notifications sync error:", error.message);
    });

    return () => unsubscribeNotifs();
  }, [user]);

  const addCar = async (newCar) => {
    try {
      if (!newCar.id) {
         newCar.id = "listing-" + Date.now();
      }
      const docRef = doc(db, "cars", newCar.id);
      await setDoc(docRef, newCar);
      // We don't need to manually update state here because onSnapshot will trigger!
    } catch (error) {
      console.error("Error adding car to Firestore:", error);
      // Fallback local update if network fails or db isn't initialized
      setCars([newCar, ...cars]);
    }
  };

  const toggleFavorite = (carId) => {
    setFavorites(prev => prev.includes(carId) ? prev.filter(id => id !== carId) : [...prev, carId]);
  };

  // Fallback local memory array for backwards compatibility
  const addNotification = (notif) => {
    setNotifications(prev => [{ id: Date.now(), ...notif }, ...prev]);
  };

  const pushNotification = async (notif) => {
    try {
      const notifId = "notif-" + Date.now();
      await setDoc(doc(db, "notifications", notifId), {
        id: notifId,
        timestamp: Date.now(),
        ...notif
      });
    } catch(error) {
      console.error("Error pushing remote notification", error);
    }
  };

  const deleteCar = async (carId) => {
    try {
      await deleteDoc(doc(db, "cars", carId));
    } catch(err) {
      setCars(cars.filter(c => c.id !== carId));
    }
  };

  const updateCar = async (carId, updates) => {
    try {
      await setDoc(doc(db, "cars", carId), updates, { merge: true });
    } catch(err) {
      setCars(cars.map(c => c.id === carId ? { ...c, ...updates } : c));
    }
  };

  const incrementViewCount = async (carId) => {
    const car = cars.find(c => c.id === carId);
    if (!car) return;
    const currentViews = car.viewCount || 0;
    try {
      await updateCar(carId, { viewCount: currentViews + 1 });
    } catch (err) {
      console.error("View increment error", err);
    }
  };

  const updateNotificationStatus = async (notifId, status) => {
    try {
      await setDoc(doc(db, "notifications", notifId), status, { merge: true });
    } catch (err) {
      console.error("Notif update error", err);
    }
  };

  return (
    <DataContext.Provider value={{ cars, addCar, deleteCar, updateCar, incrementViewCount, loading, favorites, toggleFavorite, notifications, addNotification, pushNotification, updateNotificationStatus }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

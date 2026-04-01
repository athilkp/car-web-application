import { createContext, useState, useContext, useEffect } from 'react';
import { initialCars } from '../data/cars';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [cars, setCars] = useState(initialCars); // Fallback to mock data initially
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, "cars"), (snapshot) => {
      const dbCars = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: data.id || d.id, // Prefer the explicit id if saved
          ...data
        };
      });
      
      // If the database has cars, override the mock data. Otherwise stay on mock data.
      if (dbCars.length > 0) {
        setCars(dbCars.sort((a,b) => (b.isFeatured === a.isFeatured) ? 0 : b.isFeatured ? -1 : 1));
      } else if (!window.hasUploadedInitial) {
        window.hasUploadedInitial = true;
        console.log("Database is empty. Populating with initial mock cars...");
        import('../data/cars').then(({ initialCars }) => {
          initialCars.forEach(async (car) => {
             await setDoc(doc(db, "cars", car.id), car);
          });
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <DataContext.Provider value={{ cars, addCar, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

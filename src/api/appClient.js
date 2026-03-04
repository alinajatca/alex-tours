import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  limit,
} from "firebase/firestore";

const createEntity = (collectionName) => ({
  list: async (_orderField = "created_date", maxItems = 100) => {
    const q = query(collection(db, collectionName), limit(maxItems));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
  create: async (data) => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      created_date: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  },
  update: async (id, data) => {
    await updateDoc(doc(db, collectionName, id), data);
    return { id, ...data };
  },
  delete: async (id) => {
    await deleteDoc(doc(db, collectionName, id));
    return { id };
  },
});

export const appClient = {
  entities: {
    Employee: createEntity("employees"),
    Attendance: createEntity("attendance"),
    Task: createEntity("tasks"),
    Room: createEntity("rooms"),
    Message: createEntity("messages"),
    File: createEntity("files"),
    ProductivityLog: createEntity("productivity_logs"),
  },
};
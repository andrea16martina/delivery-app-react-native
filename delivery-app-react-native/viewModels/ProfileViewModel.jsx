import CommunicationController from '../models/CommunicationController';
import StorageManager from '../models/StorageManager';

export const handleUserData = async () => {
  const db = new StorageManager();
  db.openDB();
  await db.createTables();
  let userData = await db.getUserData();
  if (userData) {
    db.closeDB();
    console.log("User data retrieved from local storage", userData);
    return userData;
  } else {
    userData = await CommunicationController.getUserData();
    if (userData) {
      await db.saveUserData(userData);
      db.closeDB();
      console.log("User data retrieved from server", userData);
      return userData;
    }
  }
}

export const handleSave = async (userData) => {
  const db = new StorageManager();
  db.openDB();
  await db.createTables();
  try {
    const response = await CommunicationController.saveUserData(userData);
    if (response === "Error") {
      alert("Dati inseriti non validi, riprova");
    } else {
      await db.updateUserData(userData);
    }
  } catch (error) {
    console.error("Error saving user data:", error);
  } finally {
    db.closeDB();
  }
}

export const handleGetLastOrder = async () => {
  const db = new StorageManager();
  db.openDB();
  await db.createTables();
  let lastOrder = await db.getLastOrder();
  db.closeDB(); 
  if (lastOrder) {  
    return lastOrder;
  } else {
    console.log("Last order not found in local storage");
  }
}
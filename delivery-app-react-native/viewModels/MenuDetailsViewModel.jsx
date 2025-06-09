import StorageManager from "../models/StorageManager";
import CommunicationController from "../models/CommunicationController";

export const handleGetDetails = async (mid) => {
    const db = new StorageManager();
    try {
        db.openDB();

        // Verifica se la descrizione lunga è presente nel database
        const dsc = await db.getMenuDescription(mid);
        if (dsc) {
            return dsc.LongDescription;
        }

        // Se la descrizione lunga non è presente, effettua una richiesta di rete e la salva nel database
        const fetchedDsc = await CommunicationController.getMenuItemDetails(mid);
        await db.saveMenuDetails(mid, fetchedDsc);
        return fetchedDsc;
    } catch (error) {
        console.error("Error processing description:", error);
        return null;
    } finally {
        db.closeDB();
    }
};

export const handleGetImg = async (mid) => {
    const db = new StorageManager();
    try {
        db.openDB();
        await db.createTables();    
        // Verifica se l'immagine è presente nel database
        const img = await db.getMenuImage(mid);
        if (img) {
            return img.Image;
        }

        // Se l'immagine non è presente, effettua una richiesta di rete e la salva nel database
        const fetchedImg = await CommunicationController.getMenuItemImage(mid);
        await db.saveMenuImage(mid, fetchedImg);
        return fetchedImg;
    } catch (error) {
        console.error("Error processing image:", error);
        return null;
    } finally {
        db.closeDB();
    }
}

export const handleOrder = async (mid) => {
    const db = new StorageManager();
    try {
        db.openDB();
        await db.createTables();
        const item = await db.getMenuItem(mid);
        if (!item) {
            throw new Error("Item not found");
        }
        const order = await CommunicationController.createOrder(mid);
        switch(order) {
            case "Invalid Card Number":
            alert("Numero di carta non valido");
            break;
            case "Order in progress":
            alert("Ordine in corso");
            break;
            default:
            await db.setLastOrder(order.oid, order.status);
            await db.saveOrder(order);
            console.log("Order processed successfully");
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error processing order:", error);
    } finally {
        db.closeDB();
    }
}

export const haveProfile = async () => {
    const db = new StorageManager();
    try {
      db.openDB();
      const userData = await db.getUserData();
      db.closeDB();
  
      if (userData && userData.FirstName && userData.LastName && userData.CardFullName && userData.CardNumber && userData.CardExpireMonth && userData.CardExpireYear && userData.CardCVV) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking profile:", error);
      return false;
    }
  }

  export const checkLastOrder = async () => {
    const db = new StorageManager();
    db.openDB();
    await db.createTables();
    let lastOrder = await db.getLastOrder();
    if (lastOrder) {
      db.closeDB();
      return lastOrder;
    } else {
      console.log("Last order not found in local storage");
    }
  }
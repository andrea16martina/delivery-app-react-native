import CommunicationController from "../models/CommunicationController";
import StorageManager from "../models/StorageManager";

// Funzione asincrona per ottenere i dati
export async function fetchData() {
    let SID = undefined; // Inizializza la variabile SID come undefined
    try {
        // Effettua una richiesta per ottenere il SID utilizzando il CommunicationController
        SID = await CommunicationController.getAndSaveSID();
    } catch (error) {
        // In caso di errore, restituisce un messaggio di errore
        console.error("Error during get object request:", error);
        return "Error during get object request";
    }

    // Restituisce il SID ottenuto
    return SID;
}

// Funzione per gestire il click sul pulsante
export const handleGetMenu = async () => {
    const db = new StorageManager();
    try {
        db.openDB();
        await db.createTables();

        // Effettua una richiesta GET generica per ottenere il menu
        const result = await CommunicationController.getMenu();
        
        if (Array.isArray(result)) {
            for (const dish of result) {
                try {
                    const menuItemExists = await db.getMenuItem(dish.mid);
                    if (!menuItemExists) {
                        await db.saveMenu(dish);
                    } else {
                        if (menuItemExists.ImageVersion !== dish.imageVersion) {
                            const fetchedImg = await CommunicationController.getMenuItemImage(mid);
                            await db.saveMenuImage(mid, fetchedImg);
                        }
                    }
                } catch (error) {
                    console.error("Error processing dish:", error);
                }
            }
            return result; // Restituisce i dati del menu
        } else {
            console.error("Invalid menu data received");
            return [];
        }
    } catch (error) {
        // Logga eventuali errori
        console.error("Error getting menu:", error);
        return [];
    } finally {
        db.closeDB();
    }
};

export const handleGetImg = async (mid) => {
    const db = new StorageManager();
    try {
        db.openDB();

        // Verifica se l'immagine è presente nel database
        const img = await db.getMenuImage(mid);
        if (img) {
            return img.Image;
        }

        // Se l'immagine non è presente, effettua una richiesta di rete e salva l'immagine nel database
        const fetchedImg = await CommunicationController.getMenuItemImage(mid);
        await db.saveMenuImage(mid, fetchedImg);
        return fetchedImg;
    } catch (error) {
        console.error("Error processing image:", error);
        return null;
    } finally {
        db.closeDB();
    }
};
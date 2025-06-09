import AsyncStorage from "@react-native-async-storage/async-storage";
import { locationPermissionAsync } from '../viewModels/MapsViewModel';

export default class CommunicationController {
    // URL base per tutte le richieste
    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";

    // Metodo statico per effettuare una richiesta generica
    static async genericRequest(endpoint, verb, queryParams, bodyParams) {
        console.log("genericRequest called");

        // Formatta i parametri della query in una stringa
        const queryParamsFormatted = new URLSearchParams(queryParams).toString();
        // Costruisce l'URL completo con i parametri della query
        const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;
        console.log("sending " + verb + " request to: " + url);

        // Configura i dati per la richiesta fetch
        let fetchData = {
            method: verb, // Metodo HTTP (GET, POST, ecc.)
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };

        // Aggiunge il corpo della richiesta se il metodo non è GET
        if (verb !== "GET") {
            fetchData.body = JSON.stringify(bodyParams);
        }

        // Effettua la richiesta HTTP
        let httpResponse = await fetch(url, fetchData);

        // Ottiene lo stato della risposta
        const status = httpResponse.status;

        // Se la risposta è corretta (stato 200), deserializza e restituisce l'oggetto JSON
        if (status === 200) {
            let deserializedObject = await httpResponse.json();
            return deserializedObject;
        } else if (status === 204) {
            // Gestisce lo stato 204 (No Content) come successo senza tentare di analizzare una risposta JSON vuota
            return null;
        } else if (status === 403) {
            return "Invalid Card Number"
        }else if (status === 409) {
            return "Order in progress"
        } else if (status === 422) {
            return "Invalid Card CVV"
        }
        else{
            // In caso di errore, ottiene il messaggio di errore dal server
            const message = await httpResponse.text();
            // Crea e lancia un errore con il messaggio del server e lo stato HTTP
            let error = new Error(
                "Error message from the server. HTTP status: " +
                    status +
                    " " +
                    message
            );
            throw error;
        }
    }

    // Metodo statico per effettuare una richiesta GET generica
    static async genericGetRequest(endpoint, queryParams) {
        console.log("genericGetRequest called");
        return await this.genericRequest(endpoint, "GET", queryParams, {});
    }

    // Metodo statico per ottenere il SID tramite una richiesta POST
    static async getAndSaveSID() {
        let response = await this.genericRequest("user/", "POST", {}); // Effettua una richiesta POST all'endpoint "user/"
        this.sid = response.sid; // Memorizza il SID dalla risposta
        this.uid = JSON.stringify(response.uid); // Memorizza l'UID dalla risposta
        // Salva il SID in memoria permanente   
        const firstRun = await AsyncStorage.getItem("SID");
        if(!firstRun){
           try {
            await AsyncStorage.setItem("SID", this.sid);
            await AsyncStorage.setItem("uid", this.uid);
          } catch (error) {
            console.log("Error saving data: ", error);
          }
        }
    }

    static async getMenu() {
        try {
            console.log("getMenu called");
            const sid = await AsyncStorage.getItem("SID");
            if (!sid) {
                throw new Error("SID not found");
            }

            const location = await locationPermissionAsync();

            const queryParams = {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
                sid: sid
            };

            const result = await this.genericGetRequest("menu", queryParams);
            return result;
        } catch (error) {
            console.error("Error getting menu:", error);
        }
    }

    static async getMenuItemImage(mid) {
        try {
            console.log("getMenuItemImage called");
            const sid = await AsyncStorage.getItem("SID");
            if (!sid) {
                throw new Error("SID not found");
            }

            const queryParams = {
                sid: sid
            };
            const result = await this.genericGetRequest("menu/"+mid.toString()+"/image", queryParams);
            return result.base64;
            } catch (error) {
            console.error("Error getting menu item image:", error);
        }
    }

    static async getMenuItemDetails(mid) {
        try {
            console.log("getMenuItemDetails called");
            const sid = await AsyncStorage.getItem("SID");
            if (!sid) {
                throw new Error("SID not found");
            }

            const location = await locationPermissionAsync();
            const queryParams = {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
                sid: sid
            };
            const result = await this.genericGetRequest("menu/"+mid.toString(), queryParams);
            return result.longDescription;
        } catch (error) {
            console.error("Error getting menu item details:", error);
        }
    }

    static async getUserData() {
        try {
            console.log("getUserData called");
            const sid = await AsyncStorage.getItem("SID");
            if (!sid) {
                throw new Error("SID not found");
            }
            const uid = await AsyncStorage.getItem("uid");

            const queryParams = {
                sid: sid
            };
            const result = await this.genericGetRequest("user/"+uid, queryParams);
            return result;
        } catch (error) {
            console.error("Error getting user data:", error);
        }
    }

    static async saveUserData(userData) {
        try {
            console.log("saveUserData called");
            const sid = await AsyncStorage.getItem("SID");
            if (!sid) {
                throw new Error("SID not found");
            }

            const uid = await AsyncStorage.getItem("uid");

            const bodyParams = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                cardFullName: userData.cardFullName,
                cardNumber: userData.cardNumber,
                cardExpireMonth: userData.cardExpireMonth,
                cardExpireYear: userData.cardExpireYear,
                cardCVV: userData.cardCVV,
                sid: sid
            };
            const response = await this.genericRequest("user/"+uid, "PUT", {}, bodyParams);
            if (response === null) {
                console.log("User data saved successfully");
            } else {
                return "Error"
            }
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    }

    static async createOrder(mid) {
        try {
            console.log("createOrder called");
            const sid = await AsyncStorage.getItem("SID");
            if (!sid) {
                throw new Error("SID not found");
            }
            
            const location = await locationPermissionAsync();
            const bodyParams = {
                sid: sid,
                deliveryLocation: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
                  }
            };

            const response = await this.genericRequest("menu/"+mid+"/buy", "POST", {}, bodyParams);
            return response;
        } catch (error) {
            console.error("Error creating order:", error);
        }
    }

    static async getOrderStatus(oid) {
        if (oid) {
          try {
            console.log("getorderStatus called");
            const sid = await AsyncStorage.getItem("SID");
            if (!sid) {
                throw new Error("SID not found");
            }

            const queryParams = {
                sid: sid
            };
            const result = await this.genericGetRequest("order/"+oid, queryParams);
            return result;
        } catch (error) {
            console.error("Error getting order status:", error);
        }  
        }
        
    }
}
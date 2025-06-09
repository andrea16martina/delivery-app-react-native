import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

class StorageManager {
    constructor() {
        this.db = null;
    }

    openDB() {
        this.db = SQLite.openDatabaseAsync('MangiaEbasta');
    }

    async createTables() {
        const query = `
        CREATE TABLE IF NOT EXISTS Menu (
            Mid INTEGER PRIMARY KEY, 
            ImageVersion INTEGER, 
            Name VARCHAR(30), 
            Price DECIMAL(5,2), 
            Location POINT, 
            ShortDescription VARCHAR(100), 
            DeliveryTime INTEGER
        );

        CREATE TABLE IF NOT EXISTS MenuImage (
            Mid INTEGER PRIMARY KEY, 
            Image TEXT, 
            FOREIGN KEY (Mid) REFERENCES Menu(Mid)
        );

        CREATE TABLE IF NOT EXISTS MenuDetails (
            Mid INTEGER PRIMARY KEY, 
            LongDescription TEXT, 
            FOREIGN KEY (Mid) REFERENCES Menu(Mid)
        );

        CREATE TABLE IF NOT EXISTS Users (
            Uid INTEGER PRIMARY KEY, 
            FirstName VARCHAR(30), 
            LastName VARCHAR(30), 
            CardFullName VARCHAR(50), 
            CardNumber VARCHAR(16), 
            CardExpireMonth VARCHAR(2), 
            CardExpireYear VARCHAR(4), 
            CardCVV VARCHAR(3), 
            LastOid INTEGER, 
            OrderStatus VARCHAR, 
            FOREIGN KEY (LastOid) REFERENCES Orders(Oid)
        );

        CREATE TABLE IF NOT EXISTS Orders (
            Oid INTEGER PRIMARY KEY,
            Mid INTEGER,
            Uid INTEGER,
            CreationTimestamp DATETIME,
            Status VARCHAR(30),
            DeliveryLocation POINT,
            DeliveryTimestamp DATETIME,
            CurrentPosition POINT,
            FOREIGN KEY (Mid) REFERENCES Menu(Mid),
            FOREIGN KEY (Uid) REFERENCES Users(Uid)
        );
        `;
        try {
            (await this.db).execAsync(query);
        } catch (error) {
            console.error("Error creating tables:", error);
        }
    }

    async saveMenu(menu) {
        const query = "INSERT INTO Menu (Mid, ImageVersion, Name, Price, Location, ShortDescription, DeliveryTime) VALUES (?, ?, ?, ?, ?, ?, ?);";
        const values = [menu.mid, menu.imageVersion, menu.name, menu.price, menu.location, menu.shortDescription, menu.deliveryTime];
        try {
            (await this.db).runAsync(query, values)
            console.log("Menu saved successfully");
        } catch (error) {
            console.error("Error saving menu:", error);
        }
    }

    async saveMenuImage(mid, img) {
        const query = "INSERT INTO MenuImage (Mid, Image) VALUES (?, ?);";
        const values = [mid, img];
        try {
            (await this.db).runAsync(query, values);
            console.log("Image saved successfully");
        } catch (error) {
            console.error("Error saving image:", error);
        }    }
    
    async saveMenuDetails(mid, details) {
        const query = "INSERT INTO MenuDetails (Mid, LongDescription) VALUES (?, ?);";
        const values = [mid, details];
        try {
            (await this.db).runAsync(query, values);
            console.log("Details saved successfully");
        } catch (error) {
            console.error("Error saving details:", error);
        }
    }

    async getMenuItem(mid) {
        const query = "SELECT * FROM Menu WHERE Mid = ?";
        const values = [mid];
        try {
            const result = (await this.db).getFirstAsync(query, values);
            console.log("Menu item retrieved successfully");
            return result;
        } catch (error) {
            console.log("Error getting menu item:", error);
        }
    }

    async getMenuImage(mid) {
        const query = "SELECT Image FROM MenuImage WHERE Mid = ?";
        const values = [mid];
        try {
            const result = (await this.db).getFirstAsync(query, values);
            console.log("Image retrieved successfully:",result);
            return result;
        } catch (error) {
            console.log("Error getting image:", error);
        }
    }

    async getMenuDescription(mid) {
        const query = "SELECT LongDescription FROM MenuDetails WHERE Mid = ?";
        const values = [mid];
        try {
            const result = (await this.db).getFirstAsync(query, values);
            console.log("Description retrieved successfully:",result);
            return result;
        } catch (error) {
            console.log("Error getting details:", error);
        }
    }

    async saveUserData(userData) {
        userData.uid = await AsyncStorage.getItem("uid");
        console.log("Saving user data:", userData);
        const query = "INSERT INTO Users (Uid, FirstName, LastName, CardFullName, CardNumber, CardExpireMonth, CardExpireYear, CardCVV, LastOid, OrderStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        const values = [userData.uid, userData.firstName, userData.lastName, userData.cardFullName, userData.cardNumber, userData.cardExpireMonth, userData.cardExpireYear, userData.cardCVV, userData.lastOid, userData.orderStatus];
        try {
            (await this.db).runAsync(query, values);
            console.log("User data saved successfully");
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    }

    async getUserData() {
        const uid = await AsyncStorage.getItem("uid");
        const query = "SELECT * FROM Users WHERE Uid = ?";
        const values = [uid];
        try {
            const result = (await this.db).getFirstAsync(query, values);
            console.log("User data retrieved successfully:",result);
            return result;
        } catch (error) {
            console.error("Error getting user data:", error);
        }
    }

    async updateUserData(userData) {
        userData.uid = await AsyncStorage.getItem("uid");
        console.log("Updating user data:", userData);
        const query = "UPDATE Users SET FirstName = ?, LastName = ?, CardFullName = ?, CardNumber = ?, CardExpireMonth = ?, CardExpireYear = ?, CardCVV = ? WHERE Uid = ?;";
        const values = [userData.firstName, userData.lastName, userData.cardFullName, userData.cardNumber, userData.cardExpireMonth, userData.cardExpireYear, userData.cardCVV, userData.uid];
        try {
            (await this.db).runAsync(query, values);
            console.log("User data updated successfully");
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    }

    async saveOrder(order) {
        const query = "INSERT INTO Orders (Oid, Mid, Uid, CreationTimestamp, Status, DeliveryLocation, DeliveryTimestamp, CurrentPosition) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
        const values = [order.oid, order.mid, order.uid, order.creationTimestamp, order.status, order.deliveryLocation, order.deliveryTimestamp, order.currentPosition];
        try {
            (await this.db).runAsync(query, values);
            console.log("Order saved successfully");
        } catch (error) {
            console.error("Error saving order:", error);
        }
    }

    async setLastOrder(oid, status) {
        const uid = await AsyncStorage.getItem("uid");
        const query = "UPDATE Users SET LastOid = ?, OrderStatus = ? WHERE Uid = ?;";
        const values = [oid, status, uid];
        try {
            (await this.db).runAsync(query, values);
            console.log("Last order set successfully");
        } catch (error) {
            console.error("Error setting last order:", error);
        }
    }

    async getLastOrder() {  
        const uid = await AsyncStorage.getItem("uid");
        const query = "SELECT LastOid, OrderStatus FROM Users WHERE Uid = ?";
        const values = [uid];
        try {
            const result = (await this.db).getFirstAsync(query, values);
            console.log("Last order retrieved successfully:",result);
            return result;
        } catch (error) {
            console.error("Error getting last order:", error);
        }
    }

    async updateOrder(order) {
        const query = "UPDATE Orders SET Status = ?, CurrentPosition = ?, DeliveryTimestamp = ? WHERE Oid = ?;";
        const values = [order.status, order.currentPosition, order.deliveryTimestamp, order.oid];
        try {
            (await this.db).runAsync(query, values);
            console.log("Order updated successfully");
        } catch (error) {
            console.error("Error updating order:", error);
        }
    }

    closeDB() {
        // Non c'è bisogno di chiudere il database manualmente con expo-sqlite
        console.log("Database closed");
    }
}

export default StorageManager;
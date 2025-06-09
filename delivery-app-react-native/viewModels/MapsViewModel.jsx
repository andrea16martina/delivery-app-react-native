import * as Location from 'expo-location';
import StorageManager from '../models/StorageManager';
import CommunicationController from '../models/CommunicationController';

export async function locationPermissionAsync() {
    let canUseLocation = false;
    const grantedPermission = await Location.getForegroundPermissionsAsync()
    if (grantedPermission.status === "granted") {
        canUseLocation = true;
    } else {
        const permissionResponse = await Location.requestForegroundPermissionsAsync()
        if (permissionResponse.status === "granted") {
        canUseLocation = true;
        }
    }
    if (canUseLocation) {
        const location = await Location.getCurrentPositionAsync({});
        return location;
    }
}

export const handleLastOrder = async () => {
    const db = new StorageManager();
    db.openDB();
    await db.createTables();
    let lastOrder = await db.getLastOrder();
    let lastOrderStatus = await CommunicationController.getOrderStatus(lastOrder.LastOid);7
    if (lastOrderStatus.status !== lastOrder.OrderStatus) {
      await db.setLastOrder(lastOrder.LastOid, lastOrderStatus.status);
      await db.updateOrder(lastOrderStatus);
    }
    db.closeDB(); 
    if (lastOrder) {  
      return lastOrderStatus;
    } else {
      console.log("Last order not found in local storage");
    }
  }  

  export const handleMenuName = async (mid) => {
    const db = new StorageManager();
    db.openDB();
    await db.createTables();
    let menuName = await db.getMenuItem(mid);
    db.closeDB(); 
    if (menuName) {  
      return menuName.Name;
    } else {
      console.log("Menu name not found in local storage");
  }
}
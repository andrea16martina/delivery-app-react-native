import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { locationPermissionAsync, handleLastOrder, handleMenuName} from '../viewModels/MapsViewModel';

const Maps = () => {
  const [position, setPosition] = useState(null);
  const [orderLocation, setOrderLocation] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await locationPermissionAsync();
      if (location) {
        setPosition({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    };

    const fetchOrderLocation = async () => {
      const location = await handleLastOrder();
      if (location) {
        setOrderLocation({
          latitude: location.currentPosition.lat,
          longitude: location.currentPosition.lng,
        });
        location.menuName = await handleMenuName(location.mid);
        setOrderDetails(location);
      }
    };

    fetchLocation();
    fetchOrderLocation();
    const interval = setInterval(fetchOrderLocation, 5000); // Aggiorna ogni 5 secondi

    return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
  }, []);

  if (!position || !orderLocation || !orderDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isDelivered = orderDetails.status === 'COMPLETED';
  const orderTime = isDelivered
    ? new Date(orderDetails.deliveryTimestamp).toLocaleString()
    : new Date(orderDetails.expectedDeliveryTimestamp).toLocaleString();

  return (
    <SafeAreaView style={styles.mapContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.menuName}>Nome del Menu: {orderDetails.menuName}</Text>
        <Text style={styles.status}>Stato: {orderDetails.status}</Text>
        <Text style={styles.time}>Tempo: {orderTime}</Text>
      </View>
      <MapView
        style={styles.map}
        showsMyLocationButton={true}
        showsUserLocation={true}
        zoomControlEnabled={true}
        loadingEnabled={true}
        initialRegion={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={position}
          title="Posizione attuale"
          description="La mia posizione attuale"
          pinColor="blue"
        />
        <Marker
          coordinate={orderLocation}
          title="Ordine"
          description="La posizione del tuo ordine"
        />
        <Polyline
          coordinates={[position, orderLocation]}
          strokeColor="green"
          strokeWidth={2}
        />
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center', // Centra gli elementi orizzontalmente
    justifyContent: 'center', // Centra gli elementi verticalmente
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginTop: 30,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  menuName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  status: {
    fontSize: 20,
    textAlign: 'center',
  },
  time: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Maps;
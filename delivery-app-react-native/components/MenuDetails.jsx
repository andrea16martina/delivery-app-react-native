import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, Alert, TouchableOpacity } from 'react-native';
import { handleGetDetails, handleOrder, haveProfile, checkLastOrder } from '../viewModels/MenuDetailsViewModel';
import styles from '../MenuDetailsStyles';

const MenuDetails = ({ item, imageUri, onOrderPlaced }) => {
  const [longDescription, setLongDescription] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [canPurchase, setCanPurchase] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const description = await handleGetDetails(item.mid);
      setLongDescription(description);
    };

    const checkProfileAndOrder = async () => {
      const profileComplete = await haveProfile();
      setIsProfileComplete(profileComplete);

      if (profileComplete) {
        const lastOrder = await checkLastOrder ();
        if (lastOrder && lastOrder.OrderStatus == 'ON_DELIVERY') {
          setCanPurchase(false);
        } else {
          setCanPurchase(true);
        }
      } else {
        setCanPurchase(false);
      }
    };

    fetchDetails();
    checkProfileAndOrder();
  }, [item.mid]);

  const handlePurchase = async () => {
    if (canPurchase) {
      const check = await handleOrder(item.mid);
      if(check) {
        Alert.alert('Conferma','Ordine effettuato con successo');
      }
    } else {
      Alert.alert('Impossibile acquistare', 'Completa il profilo e assicurati di non avere ordini in corso.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Price: ${item.price}</Text>
      <Text style={styles.shortDescription}>{item.shortDescription}</Text>
      <Text style={styles.longDescription}>{longDescription}</Text>
      <Text style={styles.deliveryTime}>Delivery Time: {item.deliveryTime} mins</Text>
      <TouchableOpacity style={styles.button} onPress={handlePurchase}>
        <Text style={styles.buttonText}>Acquista</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MenuDetails;
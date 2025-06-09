import React, { useEffect, useState } from 'react';
import { Button, View, Text, Image, TouchableOpacity } from 'react-native';
import { handleGetImg } from '../viewModels/MenuListViewModel';
import styles from '../style';

const MenuItem = ({ item, onSelectItem }) => {
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const getImage = async (mid) => {
      const base64Image = await handleGetImg(mid);
      return `data:image/jpeg;base64,${base64Image}`;
    };

    getImage(item.mid).then(setImageUri);
  }, [item.mid]);

  const navigateToDetails = () => {
    onSelectItem(item, imageUri);
  };

  return (
      <View style={styles.menuItem}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>Price: ${item.price}</Text>
        <Text style={styles.shortDescription}>{item.shortDescription}</Text>
        <Text style={styles.deliveryTime}>Delivery Time: {item.deliveryTime} mins</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToDetails} >
          <Text style={styles.buttonText}>Dettagli</Text>
        </TouchableOpacity>
      </View>
  );
};

export default MenuItem;
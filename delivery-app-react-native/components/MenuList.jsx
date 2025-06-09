import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { fetchData, handleGetMenu } from '../viewModels/MenuListViewModel';
import MenuItem from './MenuItem';
import styles from '../style'; // Importa gli stili dal file styles.js

const MenuList = ({ onSelectItem }) => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    console.log("Component loaded for the first time");

    fetchData()
      .then(() => handleGetMenu())
      .then((result) => {
        setMenuItems(result);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.mid.toString()}
        renderItem={({ item }) => <MenuItem item={item} onSelectItem={onSelectItem} />}
      />
    </View>
  );
};

export default MenuList;
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuList from './MenuList'; // Importa il componente MenuList
import Profile from './Profile'; // Importa il componente Profile
import Maps from './Maps'; // Importa il componente Maps
import MenuDetails from './MenuDetails'; // Importa il componente MenuDetails

const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('Menu');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  useEffect(() => {
    const loadLastScreen = async () => {
      const lastScreen = await AsyncStorage.getItem('lastScreen');
      const lastSelectedItem = await AsyncStorage.getItem('lastSelectedItem');
      const lastSelectedImageUri = await AsyncStorage.getItem('lastSelectedImageUri');
      if (lastScreen) {
        setCurrentScreen(lastScreen);
        if (lastSelectedItem) {
          setSelectedItem(JSON.parse(lastSelectedItem));
        }
        if (lastSelectedImageUri) {
          setSelectedImageUri(lastSelectedImageUri);
        }
      }
    };

    loadLastScreen();
  }, []);

  useEffect(() => {
    const saveLastScreen = async () => {
      await AsyncStorage.setItem('lastScreen', currentScreen);
      if (selectedItem) {
        await AsyncStorage.setItem('lastSelectedItem', JSON.stringify(selectedItem));
      }
      if (selectedImageUri) {
        await AsyncStorage.setItem('lastSelectedImageUri', selectedImageUri);
      }
    };

    saveLastScreen();
  }, [currentScreen, selectedItem, selectedImageUri]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Menu':
        return <MenuList onSelectItem={(item, imageUri) => { setSelectedItem(item); setSelectedImageUri(imageUri); setCurrentScreen('MenuDetails'); }} />;
      case 'Maps':
        return <Maps />;
      case 'Profile':
        return <Profile />;
      case 'MenuDetails':
        return <MenuDetails item={selectedItem} imageUri={selectedImageUri} />;
      default:
        return <MenuList />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentScreen('Menu')}>
          <Text style={styles.tabText}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentScreen('Maps')}>
          <Text style={styles.tabText}>Maps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentScreen('Profile')}>
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
  },
});

export default AppNavigator;
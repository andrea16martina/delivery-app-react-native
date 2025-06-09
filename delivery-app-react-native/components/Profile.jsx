import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { handleUserData, handleSave, handleGetLastOrder } from '../viewModels/ProfileViewModel';
import styles from '../ProfileStyle';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardFullName, setCardFullName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpireMonth, setCardExpireMonth] = useState('');
  const [cardExpireYear, setCardExpireYear] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await handleUserData();
      console.log("User data retrieved successfully:", data);
      if (data) {
        setFirstName(data.FirstName);
        setLastName(data.LastName);
        setCardFullName(data.CardFullName);
        setCardNumber(data.CardNumber);
        setCardExpireMonth(data.CardExpireMonth);
        setCardExpireYear(data.CardExpireYear);
        setCardCVV(data.CardCVV);
      }
    };

    fetchData();
    const fetchLastOrder = async () => {
    const order = await handleGetLastOrder();
    setLastOrder(order);
    };

    fetchLastOrder();
  }, []);


  const handleSaveProfile = async () => {
    const userData = {
      firstName,
      lastName,
      cardFullName,
      cardNumber,
      cardExpireMonth,
      cardExpireYear,
      cardCVV,
    };
    try {
      await handleSave(userData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <Text>First Name</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
          <Text>Last Name</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
          <Text>Card Full Name</Text>
          <TextInput style={styles.input} value={cardFullName} onChangeText={setCardFullName} />
          <Text>Card Number</Text>
          <TextInput style={styles.input} value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" maxLength={16} />
          <Text>Card Expire Month</Text>
          <TextInput style={styles.input} value={cardExpireMonth} onChangeText={setCardExpireMonth} keyboardType="numeric" maxLength={2} />
          <Text>Card Expire Year</Text>
          <TextInput style={styles.input} value={cardExpireYear} onChangeText={setCardExpireYear} keyboardType="numeric" maxLength={4} />
          <Text>Card CVV</Text>
          <TextInput style={styles.input} value={cardCVV} onChangeText={setCardCVV} keyboardType="numeric" maxLength={3} />
          <TouchableOpacity style={styles.button} onPress={() => handleSaveProfile()}>
        <Text style={styles.buttonText}>Salva</Text>
      </TouchableOpacity>
        </>
      ) : (
        <>
          <Text>First Name: {firstName}</Text>
          <Text>Last Name: {lastName}</Text>
          <Text>Card Full Name: {cardFullName}</Text>
          <Text>Card Number: {cardNumber}</Text>
          <Text>Card Expire Month: {cardExpireMonth}</Text>
          <Text>Card Expire Year: {cardExpireYear}</Text>
          <Text>Card CVV: {cardCVV}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Modifica</Text>
          </TouchableOpacity>
        </>
      )}
      {lastOrder ? (
        <View style={styles.orderContainer}>
          <Text>Last Order:</Text>
          <Text>Order ID: {lastOrder.LastOid}</Text>
          <Text>Status: {lastOrder.OrderStatus}</Text>
        </View>
      ) : 
      (
        <View style={styles.orderContainer}>
        <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
};

export default Profile;
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffe0',
      padding: 20,
      alignItems: 'center', // Centra gli elementi orizzontalmente
      justifyContent: 'center', // Centra gli elementi verticalmente
    },
    image: {
      width: '100%',
      height: 350,
      marginBottom: 20,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center', // Centra il testo
    },
    price: {
      fontSize: 20,
      textAlign: 'center', // Centra il testo
    },
    shortDescription: {
      fontSize: 16,
      textAlign: 'center', // Centra il testo
    },
    longDescription: {
      fontSize: 16,
      marginTop: 10,
      textAlign: 'center', // Centra il testo
    },
    deliveryTime: {
      fontSize: 14,
      color: 'gray',
      textAlign: 'center', // Centra il testo
    },
    button: {
      backgroundColor: '#ffa500', // Arancione
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });

  export default styles;
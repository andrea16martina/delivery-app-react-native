import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffe0',
    alignItems: 'center', // Centra gli elementi orizzontalmente
    justifyContent: 'center', // Centra gli elementi verticalmente
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%', // Imposta una larghezza per gli input
  },
  orderContainer: {
    marginTop: 20,
    alignItems: 'center', // Centra gli elementi orizzontalmente
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

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 10, 
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2F4858',
  },

  map: {
    flex: 1,
    width: '100%',
    height:'100%',
  },

  buscar: {
    
    zIndex: 1,
    flex: .065,
    width: '100%',
    borderWidth:5 ,
    borderColor: '#000000',
    borderRadius:10,
  },

  buttontext: {
    fontSize: 20,
  },

  infoContanier: {
    width: "100%",
    backgroundColor: '#2F4858',
    alignItems: "center",
    height: 70,
    borderRadius: 10,
    position:'relative',
  },

  infoText: {
    color: '#fff',
    fontSize: 20,
  },

  returnButton: {
    opacity: 0.7,
    zIndex: 1,
    backgroundColor: '#00887A',
    borderRadius: 30,
    position: 'absolute',
    bottom: 75,
    right: 10,
    width: 30,
    height: 30,

  },

  buttonImage: {
    width: 30,
    height: 30,
    marginRight: 5,

  },

});
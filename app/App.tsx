import { View, TouchableOpacity, Image, Text } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from 'expo-location'
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import { styles } from '../styles';
import tsconfig from '../tsconfig.json'
import { TouchableWithoutFeedback, Keyboard } from "react-native";

export default function Home() {
  const handleHomePress = () => {
    Keyboard.dismiss();
  };

  // Função para retornar ao marcador da posição atual
  const returnToMarker = () => {
    if (location) {
      mapRef.current?.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
    }
  };

  // Estados para armazenar informações sobre a localização e destino
  const [distance, setDistance] = useState<number | null>(null); // Distância
  const [duration, setDuration] = useState<number | null>(null); // Tempo de percurso
  const [destination, setDestination] = useState(null); // Destino da busca
  const [location, setLocation] = useState<LocationObject | null>(null); // Sua localização
  const mapRef = useRef<MapView>(null); // Referência para o mapa
  // Variável para armazenar a posição atual
  let estouaqui = null;

  // Estado para mostrar o marcador de destino
  const [showDestinationMarker, setShowDestinationMarker] = useState(false);

  // Função para solicitar permissões de localização
  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  // Efeito para solicitar permissões de localização ao montar o componente
  useEffect(() => {
    requestLocationPermissions();
  }, []);

  // Efeito para acompanhar a posição atual
  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Balanced,
      timeInterval: 100,
      distanceInterval: 1
    }, (response) => {
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch: 1,
        center: response.coords,
      });
    });
  }, []);

  // Se houver uma localização atual, define a região "estouaqui"
  if (location) {
    estouaqui = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
  }

  // Função para renderizar o marcador de destino
  const renderDestinationMarker = () => {
    if (showDestinationMarker && destination) {
      return (
        <Marker
          title='Destino'
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
        />
      );
    }
    return null;
  };

  return (
    <TouchableWithoutFeedback onPress={handleHomePress}>
    <View style={styles.container}>
      <View style={styles.buscar}>{/* Barra de busca */}
        <GooglePlacesAutocomplete
          placeholder='Onde você quer ir?'
          onPress={(data, details = null) => {
            setDestination({
              latitude: details?.geometry.location.lat,
              longitude: details?.geometry.location.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
            setShowDestinationMarker(false);
          }}
          query={{
            key: tsconfig.keyapi,
            language: 'pt-br',
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
          styles={{ listView: { height: 100, position:'absolute',top:45,} }}
        />
       
      </View>
      {/* Botão para retornar ao marcador */}
      <TouchableOpacity style={styles.returnButton} onPress={returnToMarker}>
        <Image source={require('../assets/images/reposiciona.png')} style={styles.buttonImage}></Image>
      </TouchableOpacity>
      {/* Mapa */}
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={estouaqui || undefined}
          
          followsUserLocation={true} >

          {/* Marcador da posição atual */}
          <Marker
            title='Estou aqui'
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
          {/* Renderiza o marcador de destino */}
          {renderDestinationMarker()}
          {/* Renderiza o trajeto até o destino */}
          {destination && (
            <MapViewDirections
              origin={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              destination={destination}
              apikey={tsconfig.keyapi}
              strokeWidth={5}
              strokeColor='#002ec4'
              onReady={(result) => {
                // Ajusta a visualização do mapa para incluir o trajeto
                mapRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
                });
                // Define a distância e a duração com base nos resultados
                setDistance(result.distance);
                setDuration(result.duration);
                setShowDestinationMarker(true);
              }}
            />
          )}
        </MapView>
      )}
      
       {/* Exibe informações sobre a distância e o tempo estimado */}
        { distance !== null && duration !== null && (
          <View style={styles.infoContanier}>
            <Text style={styles.infoText}>Distância: {distance.toFixed(2)} km</Text>
            <Text style={styles.infoText}>Tempo estimado: {duration.toFixed(0)} minutos</Text>
          </View>
        )}
    </View>
    </TouchableWithoutFeedback>
  );
}

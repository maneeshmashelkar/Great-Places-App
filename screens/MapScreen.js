import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Colors from "../constants/Colors";

const MapScreen = (props) => {
  const readOnly = props.navigation.getParam("readOnly");
  const initialLocation = props.navigation.getParam("initialLocation");

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 18.929,
    longitude: initialLocation ? initialLocation.lng : 73.2351,
    latitudeDelta: 1,
    longitudeDelta: 1,
  };

  const selectedLocationHandler = (event) => {
    if (readOnly) {
      return;
    }
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert("Error!", "Please select the location.", [{ text: "Okay" }]);
      return;
    }

    props.navigation.navigate("NewPlace", { pickedLocation: selectedLocation });
  }, [selectedLocation]);

  useEffect(() => {
    props.navigation.setParams({ saveLocation: savePickedLocationHandler });
  }, [savePickedLocationHandler]);

  let markedSelectLocation;

  if (selectedLocation) {
    markedSelectLocation = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };
  }

  return (
    <MapView
      style={styles.mapStyle}
      region={mapRegion}
      onPress={selectedLocationHandler}
    >
      {markedSelectLocation && (
        <Marker
          title="Picked Location"
          coordinate={markedSelectLocation}
          pinColor="red"
        />
      )}
    </MapView>
  );
};

MapScreen.navigationOptions = (navData) => {
  const saveFn = navData.navigation.getParam("saveLocation");
  const readOnly = navData.navigation.getParam("readOnly");

  if (readOnly) {
    return {};
  }

  return {
    headerRight: () => (
      <TouchableOpacity style={styles.headerButton} onPress={saveFn}>
        <Text style={styles.headerButtonText}>Save</Text>
      </TouchableOpacity>
    ),
  };
};

const styles = StyleSheet.create({
  mapStyle: {
    flex: 1,
  },
  headerButton: {
    marginHorizontal: 15,
  },
  headerButtonText: {
    fontSize: 18,
    color: Platform.OS === "android" ? "white" : Colors.primary,
  },
});

export default MapScreen;

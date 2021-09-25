import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import Colors from "../constants/Colors";
import * as Location from "expo-location";
import MapPreview from "./MapPreview";

const LocationPicker = (props) => {
  const [pickedLocation, setPickedLocation] = useState();
  const [isFetching, setIsFetching] = useState(false);

  const mapPickedLocation = props.navigation.getParam("pickedLocation");

  const { onLocationPicked } = props;

  useEffect(() => {
    if (mapPickedLocation) {
      setPickedLocation(mapPickedLocation);
      onLocationPicked(mapPickedLocation);
    }
  }, [mapPickedLocation, onLocationPicked]);

  const verifyPermissions = async () => {
    const response = await Location.requestForegroundPermissionsAsync();
    if (response.status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "you need to grant permission to use this app",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return false;
    }

    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeInterval: 5000,
      });
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      props.onLocationPicked({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      // console.log(error);
      Alert.alert(
        "Could not fetch location",
        "Please try again later or pick a loaction on the map",
        [{ text: "Okay" }]
      );
    }

    setIsFetching(false);
  };

  const pickOnMapHandler = () => {
    props.navigation.navigate("Map");
  };

  return (
    <View style={styles.locationPicker}>
      <MapPreview
        onPress={pickOnMapHandler}
        style={styles.mapPreview}
        location={pickedLocation}
      >
        {pickedLocation ? (
          <ActivityIndicator color={Colors.primary} size="large" />
        ) : (
          <Text>No Preview</Text>
        )}
      </MapPreview>
      <View style={styles.actions}>
        <Button
          title="Get user location"
          color={Colors.primary}
          onPress={getLocationHandler}
        />
        <Button
          title="pick on Map"
          color={Colors.primary}
          onPress={pickOnMapHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15,
  },
  mapPreview: {
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    width: "100%",
    height: 150,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});

export default LocationPicker;

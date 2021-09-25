import React, { useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";

const ImgPicker = (props) => {
  const [pickedImage, setPickedImage] = useState();

  const verifyPermissions = async () => {
    const response = await ImagePicker.requestCameraPermissionsAsync();
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

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    const image = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      allowsEditing: true,
      aspect: [16, 9],
    });

    if (!image.cancelled) {
      setPickedImage(image.uri);
      props.selectedImage(image.uri);
    }
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imageContainer}>
        {!pickedImage ? (
          <Text>No image picked yet.</Text>
        ) : (
          <Image source={{ uri: pickedImage }} style={styles.image} />
        )}
      </View>
      <Button
        title="Take Image"
        color={Colors.primary}
        onPress={takeImageHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center",
    marginBottom: 15,
  },
  imageContainer: {
    marginBottom: 10,
    width: "100%",
    height: 200,
    borderColor: "#ccc",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImgPicker;

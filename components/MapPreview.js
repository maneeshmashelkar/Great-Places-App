import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";
import ENV from "../env";

const MapPreview = (props) => {
  let imgPreviewUrl;
  if (props.location) {
    // imgPreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${props.location.lat},${props.location.lng}&zoom=13&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${props.location.lat},${props.location.lng}&key=${ENV.googleApiKey}`;

    imgPreviewUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+ff0a0a(${props.location.lng},${props.location.lat})/${props.location.lng},${props.location.lat},14.84,0/400x200?access_token=${ENV.mapBoxApi}`;
  }
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{ ...styles.mapPreview, ...props.style }}
    >
      {props.location ? (
        <Image style={styles.mapImage} source={{ uri: imgPreviewUrl }} />
      ) : (
        props.children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: "center",
    alignItems: "center",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
});

export default MapPreview;

import * as FileSystem from "expo-file-system";
import { fetchPlaces, insertPlace } from "../helpers/db";
import ENV from "../env";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";

export const addPlace = (title, image, location) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lng},${location.lat}.json?access_token=${ENV.mapBoxApi}`
    );

    if (!response.ok) {
      throw new Error("Something went wrong in fetching address!");
    }

    const resData = await response.json();

    if (!resData.features) {
      throw new Error("Something went wrong in fetching address!");
    }

    const address = resData.features[0].place_name;
    // console.log(address);
    const fileName = image.split("/").pop();
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath,
      });
      const dbResult = await insertPlace(
        title,
        newPath,
        address,
        location.lat,
        location.lng
      );
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          address: address,
          coords: { lat: location.lat, lng: location.lng },
        },
      });
    } catch (error) {
      console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async (dispatch) => {
    try {
      const dbResult = await fetchPlaces();
      dispatch({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (error) {
      console.log(err);
      throw err;
    }
  };
};

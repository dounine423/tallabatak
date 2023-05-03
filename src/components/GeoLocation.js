import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";

export async function requestLocationPermission() {
  if (Platform.OS == "ios") {
    this.getOneTimeLocation();
    this.subscribeLocation();
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Access Required",
          message: "This App to Access your location",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getOneTimeLocation();
        this.subscribeLocation();
        const { currentLatitude, currentLongitude } = this.state;
        console.log(currentLatitude, currentLongitude);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export const getOneTimeLocation = () => {
  let location = {};
  Geolocation.getCurrentPosition((position) => {
    const currentLongitude = JSON.stringify(position.coords.longitude);
    const currentLatitude = JSON.stringify(position.coords.latitude);
    location = {
      currentLatitude,
      currentLongitude,
      type: location,
    };
    return location;
  });
  return location;
};

export const subscribeLocation = () => {
  watchID = Geolocation.watchPosition((position) => {
    const currentLongitude = JSON.stringify(position.coords.longitude);
    const currentLatitude = JSON.stringify(position.coords.latitude);
    this.setState({
      currentLongitude,
      currentLatitude,
    });
  });
};

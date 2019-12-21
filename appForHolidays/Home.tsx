import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  Alert,
  TextInput
} from "react-native";
import { Icon, Button, colors } from "react-native-elements";

import { getWeatherFromApi } from "./Service/getApi";
import { ReloadInstructions } from "react-native/Libraries/NewAppScreen";

export default class Home extends React.Component<
  {},
  {
    recupData: any[];
    recupTemp: any[];
    recupSys: any[];
    recupWeather: any[];
    recupWind: any[];
    recupWeatherMain: string;
    recupPrecip: number;
    city: string;
    modalVisible: boolean;
    onChangeText: string;
  }
> {
  loadData(ville: string) {
    getWeatherFromApi(ville).then(data => {
      console.log(data);
      let recupIcon = this.giveIcon(data["weather"][0]["main"]);
      let recupPrecipitation = 0;
      try {
        if (data["rain"]["3h"] != undefined && data["rain"]["3h"] != null) {
          recupPrecipitation = data["rain"]["3h"];
        }
      } catch (error) {
        console.error(error);
      }

      this.setState({
        recupData: data,
        recupTemp: data["main"],
        recupSys: data["sys"],
        recupWeather: data["weather"],
        recupWeatherMain: recupIcon,
        recupWind: data["wind"],
        recupPrecip: recupPrecipitation
      });
    });
  }

  toCelsius(k) {
    return Math.round(k - 273.15);
  }

  meterSecToKmHours(speed: number) {
    return Math.round(speed * 3.6);
  }

  toHoursMinSec(timestamp) {
    let date = new Date(parseInt(timestamp) * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return hours + "h " + minutes;
  }

  giveIcon(main) {
    switch (main) {
      case "Rain":
        return "weather-pouring";

      case "shower rain":
        return "weather-pouring";

      case "Clear":
        return "weather-sunny";

      case "Clouds":
        return "weather-cloudy";

      case "scattered clouds":
        return "weather-cloudy";

      case "broken clouds":
        return "weather-cloudy";

      case "thunderstorm":
        return "weather-lightning";

      case "Snow":
        return "weather-snowy-heavy";

      case "mist":
        return "weather-fog";

      default:
        return "cloud";
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      recupData: [],
      recupTemp: [],
      recupSys: [],
      recupWeather: [],
      recupWeatherMain: "",
      city: "Paris",
      modalVisible: false,
      onChangeText: "Ville",
      recupPrecip: 0,
      recupWind: []
    };
    this.loadData(this.state.city);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View
            style={{
              marginTop: 22,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <TextInput
                style={{
                  height: 40,
                  width: 250,
                  textAlign: "center",
                  borderColor: "white",
                  borderWidth: 1,
                  borderRadius: 20,
                  color: "white"
                }}
                onChangeText={text =>
                  this.setState({
                    onChangeText: text
                  })
                }
                value={this.state.onChangeText}
              />
              <Button
                title="Modifier la ville"
                type="clear"
                raised
                titleStyle={{
                  color: "white",
                  fontSize: 30
                }}
                onPress={() => {
                  this.loadData(this.state.onChangeText);
                  this.setModalVisible(!this.state.modalVisible);
                }}
              ></Button>
              <Button
                title="Revenir à l'accueil"
                type="clear"
                raised
                titleStyle={{
                  color: "white",
                  fontSize: 15
                }}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              ></Button>
            </View>
          </View>
        </Modal>

        <Icon
          name={this.state.recupWeatherMain}
          type="material-community"
          color="#EBEBEB"
          size={120}
        />
        <TouchableWithoutFeedback
          onLongPress={() => this.setModalVisible(true)}
        >
          <Text style={styles.name}>{this.state.recupData["name"]}</Text>
        </TouchableWithoutFeedback>
        <Text style={styles.fontAll}>
          Min : {this.toCelsius(this.state.recupTemp["temp_min"])}°
        </Text>
        <Text style={styles.fontAll}>
          Max : {this.toCelsius(this.state.recupTemp["temp_max"])}°
        </Text>
        <Text style={styles.fontAll}>
          Ressentie : {this.toCelsius(this.state.recupTemp["feels_like"])}°
        </Text>
        <Text style={styles.fontAll}>
          Humidité : {this.state.recupTemp["humidity"]} %
        </Text>
        <View style={styles.temps}>
          <Icon
            name="weather-sunset-up"
            type="material-community"
            color="#EBEBEB"
            size={30}
          />
          <Text style={styles.fontTemp}>
            {this.toHoursMinSec(this.state.recupSys["sunrise"])}
          </Text>
        </View>
        <View style={styles.temps}>
          <Icon
            name="weather-sunset-down"
            type="material-community"
            color="#EBEBEB"
            size={30}
          />
          <Text style={styles.fontTemp}>
            {this.toHoursMinSec(this.state.recupSys["sunset"])}
          </Text>
        </View>
        <View style={styles.temps}>
          <Icon
            name="water-percent"
            type="material-community"
            color="#EBEBEB"
            size={30}
          />
          <Text style={styles.fontTemp}>{this.state.recupPrecip} mm</Text>
        </View>
        <View style={styles.temps}>
          <Icon
            name="weather-windy"
            type="material-community"
            color="#EBEBEB"
            size={30}
          />
          <Text style={styles.fontTemp}>
            {this.meterSecToKmHours(this.state.recupWind["speed"])} km/h
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  name: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 40
  },
  fontAll: {
    justifyContent: "center",
    textAlign: "center",
    flexDirection: "row",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20
  },
  temps: {
    justifyContent: "center",
    textAlign: "center",
    flexDirection: "row"
  },
  fontTemp: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  }
});

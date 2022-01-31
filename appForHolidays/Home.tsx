import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  TextInput
} from "react-native";
import { Icon, Button } from "react-native-elements";
import GestureRecognizer from "react-native-swipe-gestures";

import { getWeatherFromApi } from "./Service/getApi";
import { getWeatherDayFromApi } from "./Service/getApiDay";

// A finir: faire en sorte qu'il y ai une valeur par defaut
// a city et onchangetext si on met rien dans le input
// de la ville

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
    mode: string;
  }
> {
  loadData(ville: string) {
    getWeatherFromApi(ville).then(data => {
      let recupIcon = this.giveIcon(data["weather"][0]["main"]);
      let recupPrecipitation = 0;
      try {
        if (data["rain"]["3h"] != undefined && data["rain"]["3h"] != null) {
          recupPrecipitation = data["rain"]["3h"];
        }
      } catch (error) {}

      this.setState({
        recupData: data,
        recupTemp: data["main"],
        recupSys: data["sys"],
        recupWeather: data["weather"],
        recupWeatherMain: recupIcon,
        recupWind: data["wind"],
        recupPrecip: recupPrecipitation,
        mode: "clock-outline"
      });
    });
  }

  loadDayData(ville: string) {
    getWeatherDayFromApi(ville).then(data => {
      let recupDayAfter = data["list"][7];
      let allCityData = data["city"];
      console.log(this.toMonthAndDay(recupDayAfter["dt"]));
      let recupIcon = this.giveIcon(recupDayAfter["weather"][0]["main"]);
      let recupPrecipitation = 0;
      try {
        if (
          recupDayAfter["rain"]["3h"] != undefined &&
          recupDayAfter["rain"]["3h"] != null
        ) {
          recupPrecipitation = recupDayAfter["rain"]["3h"];
        }
      } catch (error) {}

      this.setState({
        recupData: allCityData,
        recupTemp: recupDayAfter["main"],
        recupSys: allCityData,
        recupWeather: recupDayAfter["weather"],
        recupWeatherMain: recupIcon,
        recupWind: recupDayAfter["wind"],
        recupPrecip: recupPrecipitation,
        mode: "calendar-today"
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
    return hours + " h " + minutes;
  }

  toHoursMinSecPlus3(timestamp) {
    let date = new Date(parseInt(timestamp));
    let hours = date.getUTCHours();
    date.setMinutes(date.getUTCMinutes() + 180); // A revoir
    let minutes = date.getUTCMinutes();
    return hours + " h " + minutes;
  }

  toMonthAndDay(timestamp) {
    let date = new Date(timestamp * 1000);
    return date.getUTCDate().toString() + "/" + (date.getUTCMonth() + 1); // Enlever le 1 pour revoir la partie date
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
      city: "Dax",
      modalVisible: false,
      onChangeText: "Ville",
      recupPrecip: 0,
      recupWind: [],
      mode: "clock-outline"
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
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => this.setModalVisible(!this.state.modalVisible)}
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
                  onFocus={() => {
                    this.setState({
                      onChangeText: ""
                    });
                  }}
                  onChangeText={text => {
                    this.setState({
                      onChangeText: text
                    });
                  }}
                  value={this.state.onChangeText}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Button
                    title="Accueil"
                    type="clear"
                    raised
                    titleStyle={{
                      color: "white",
                      fontSize: 20
                    }}
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}
                  ></Button>
                  <Button
                    title="Modifier"
                    type="clear"
                    raised
                    titleStyle={{
                      color: "white",
                      fontSize: 20
                    }}
                    onPress={() => {
                      this.setState({
                        city: this.state.onChangeText
                      });
                      this.loadData(this.state.onChangeText);
                      this.setModalVisible(!this.state.modalVisible);
                    }}
                  ></Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <GestureRecognizer
          onSwipeRight={() => this.loadDayData(this.state.city)}
          onSwipeLeft={() => this.loadData(this.state.city)}
        >
          <TouchableWithoutFeedback
            onLongPress={() => this.setModalVisible(true)}
          >
            <View>
              <Icon
                name={this.state.recupWeatherMain}
                type="material-community"
                color="#EBEBEB"
                size={120}
              />
              <Text style={styles.name}>{this.state.recupData["name"]}</Text>
            </View>
          </TouchableWithoutFeedback>
          <Icon
            name={this.state.mode}
            type="material-community"
            color="#EBEBEB"
            size={50}
          />
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
          <View style={{ marginTop: 20 }}>
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
        </GestureRecognizer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  fontDate: {
    justifyContent: "center",
    textAlign: "center"
  },
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
    color: "white"
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

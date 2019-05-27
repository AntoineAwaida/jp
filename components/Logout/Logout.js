import React, { Component } from "react";

import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "react-native-paper";

import PropTypes from "prop-types";
import AsyncStorage from "@react-native-community/async-storage";
import saveTournee from "../Sync/saveTournee";
import logError from "../Settings/logError";
import BottomMessage from "../Layout/Alert/bottomMessage";
import { EventEmitter } from "events";

class Logout extends Component {
  constructor(props, context) {
    super(props, context);
    this._emitter = new EventEmitter();

    this.state = {
      error: false,
      message: null
    };
  }

  async _logout() {
    if (await this.saveTournee()) {
      await AsyncStorage.removeItem("user");

      AsyncStorage.removeItem("user").then(() =>
        this.props.navigation.navigate("Login")
      );
    } else {
      logError("No Pocket PC code provided !");
      this.setState(
        {
          error: true,
          message: "Please set a pocket PC in settings!"
        },
        () => {
          this._emitter.emit("trigger-message");
        }
      );
    }
  }

  async saveTournee() {
    let tournee = await AsyncStorage.getItem("tournee");
    tournee = JSON.parse(tournee);
    tournee.HeureFin = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    let credentials = await AsyncStorage.getItem("credentials");
    credentials = JSON.parse(credentials);

    if (credentials.depot) {
      tournee.Code_PocketPC = credentials.depot;

      console.log(tournee);

      await saveTournee(tournee);

      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity onPress={() => this._logout()}>
            <Button color="red" mode="contained">
              Logout
            </Button>
          </TouchableOpacity>
        </View>
        <BottomMessage
          msg={this.state.message}
          error={this.state.error}
          emitter={this._emitter}
        />
      </>
    );
  }
}

Logout.propTypes = {
  navigation: PropTypes.any
};

export default Logout;

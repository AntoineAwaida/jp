import React, { Component } from "react";

import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

import AsyncStorage from "@react-native-community/async-storage";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import PropTypes from "prop-types";

class Settings extends Component {
  _logout() {
    AsyncStorage.removeItem("user").then(() =>
      this.props.navigation.navigate("Login")
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 0.85, justifyContent: "center", alignItems: "center" }}
        >
          <FontAwesome5 name="sync-alt" size={80} color="#571db2" />
          <TouchableOpacity>
            <Button style={{ marginTop: 50 }} color="#571db2" mode="contained">
              Sync
            </Button>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.15, alignItems: "center" }}>
          <TouchableOpacity onPress={() => this._logout()}>
            <Button color="red" mode="contained">
              Logout
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Settings.propTypes = {
  navigation: PropTypes.any
};

export default Settings;

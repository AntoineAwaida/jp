import React, { Component } from "react";

import { View } from "react-native";
import BluetoothConn from "../Orders/viewOrder/BluetoothConn";

export default class UserSettings extends Component {
  render() {
    return (
      <View style={{ flex: 1, marginTop: 50 }}>
        <BluetoothConn />
      </View>
    );
  }
}

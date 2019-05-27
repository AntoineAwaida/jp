import React, { Component } from "react";

import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";

import AsyncStorage from "@react-native-community/async-storage";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import PropTypes from "prop-types";
import { Input, Icon } from "react-native-elements";

import MSSQL from "react-native-mssql";

import testConnection from "./testConnection";
import BottomMessage from "../Layout/Alert/bottomMessage";
import { EventEmitter } from "events";
import logError from "./logError";
import logCredentials from "./logCredentials";

class Settings extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isTesting: false,
      connSuccessful: null,
      message: null,
      error: null,
      server: null,
      username: null,
      database: null,
      password: null,
      port: null,
      depot: null
    };
    this._emitter = new EventEmitter();
    this._emitter.setMaxListeners(0);

    this.changeDatabase = this.changeDatabase.bind(this);
    this.changeServer = this.changeServer.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeDepot = this.changeDepot.bind(this);
    this.changePort = this.changePort.bind(this);
  }

  async componentDidMount() {
    let credentials = await AsyncStorage.getItem("credentials");
    if (credentials) {
      credentials = await JSON.parse(credentials);
      this.setState({
        server: credentials.server,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database,
        depot: credentials.depot
      });
    }
  }

  testConnection() {
    this.setState({ isTesting: true }, () => {
      testConnection()
        .then(res => {
          console.log(res);
          this.setState({ isTesting: false, connSuccessful: true });
        })
        .catch(err => {
          logError(err);
          console.log(err);
          this.setState(
            {
              isTesting: false,
              connSuccessful: false,
              message: "Error while connecting to the remote database.",
              error: true
            },
            () => {
              this._emitter.emit("trigger-message");
            }
          );
        });
    });
  }

  async saveSettings() {
    await logCredentials(
      this.state.server,
      this.state.username,
      this.state.password,
      this.state.database,
      this.state.port,
      this.state.depot
    );
    this.setState(
      { message: "Credentials successfully uypdated", error: false },
      () => {
        this._emitter.emit("trigger-message");
      }
    );
  }

  changePort(port) {
    this.setState({ port: port });
  }

  changeUsername(name) {
    this.setState({ username: name });
  }

  changePassword(password) {
    this.setState({ password: password });
  }

  changeServer(server) {
    this.setState({ server: server });
  }

  changeDatabase(database) {
    this.setState({ database: database });
  }

  changeDepot(depot) {
    this.setState({ depot: depot });
  }

  render() {
    return (
      <>
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={style.logContainer}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Logs")}
              >
                <Button mode="text">
                  <FontAwesome5 name="bars" /> Logs
                </Button>
              </TouchableOpacity>
            </View>
            <View style={style.container}>
              <View style={style.form}>
                <Input
                  onChangeText={this.changeServer}
                  value={this.state.server}
                  placeholder="Server"
                  name="Server"
                  clearTextOnFocus={true}
                  inputContainerStyle={style.dividerStyle}
                  textContentType="username"
                  placeholderTextColor="#6200ee"
                  selectionColor="grey"
                  inputStyle={{ color: "#6200ee", marginLeft: 15 }}
                  leftIcon={
                    <Icon
                      type="font-awesome"
                      name="user"
                      size={20}
                      color="white"
                    />
                  }
                />
                <Input
                  onChangeText={this.changeUsername}
                  value={this.state.username}
                  placeholder="Username"
                  name="Username"
                  clearTextOnFocus={true}
                  inputContainerStyle={style.dividerStyle}
                  textContentType="username"
                  placeholderTextColor="#6200ee"
                  selectionColor="grey"
                  inputStyle={{ color: "#6200ee", marginLeft: 15 }}
                  leftIcon={
                    <Icon
                      type="font-awesome"
                      name="user"
                      size={20}
                      color="white"
                    />
                  }
                />
                <Input
                  onChangeText={this.changePassword}
                  value={this.state.password}
                  shake={true}
                  name="password"
                  placeholder="Password"
                  clearTextOnFocus={true}
                  inputContainerStyle={style.dividerStyle}
                  inputStyle={{ color: "#6200ee", marginLeft: 10 }}
                  placeholderTextColor="#6200ee"
                  secureTextEntry={true}
                  textContentType="password"
                  leftIcon={<FontAwesome5 name="key" size={20} color="white" />}
                />
                <Input
                  onChangeText={this.changeDatabase}
                  value={this.state.database}
                  placeholder="Database"
                  name="Database"
                  clearTextOnFocus={true}
                  inputContainerStyle={style.dividerStyle}
                  textContentType="username"
                  placeholderTextColor="#6200ee"
                  selectionColor="grey"
                  inputStyle={{ color: "#6200ee", marginLeft: 15 }}
                  leftIcon={
                    <Icon
                      type="font-awesome"
                      name="user"
                      size={20}
                      color="white"
                    />
                  }
                />
                <Input
                  onChangeText={this.changePort}
                  value={this.state.port}
                  keyboardType="numeric"
                  placeholder="Port"
                  name="port"
                  clearTextOnFocus={true}
                  inputContainerStyle={style.dividerStyle}
                  textContentType="username"
                  placeholderTextColor="#6200ee"
                  selectionColor="grey"
                  inputStyle={{ color: "#6200ee", marginLeft: 15 }}
                  leftIcon={
                    <Icon
                      type="font-awesome"
                      name="user"
                      size={20}
                      color="white"
                    />
                  }
                />
                <Input
                  onChangeText={this.changeDepot}
                  value={this.state.depot}
                  shake={true}
                  name="nbdepot"
                  placeholder="Depot"
                  clearTextOnFocus={true}
                  inputContainerStyle={style.dividerStyle}
                  inputStyle={{ color: "#6200ee", marginLeft: 10 }}
                  placeholderTextColor="#6200ee"
                  leftIcon={<FontAwesome5 name="key" size={20} color="white" />}
                />
              </View>

              <View
                style={{ flex: 0.1, justifyContent: "center", marginTop: 50 }}
              >
                <TouchableOpacity>
                  <Button mode="contained" onPress={() => this.saveSettings()}>
                    Save settings
                  </Button>
                </TouchableOpacity>
              </View>
            </View>

            <View style={style.login}>
              <TouchableOpacity>
                {!this.state.connSuccessful ? (
                  <Button
                    mode="contained"
                    color="purple"
                    loading={this.state.testConnection}
                    onPress={() => this.testConnection()}
                  >
                    Test connection
                  </Button>
                ) : (
                  <Button
                    color="green"
                    mode="contained"
                    loading={this.state.testConnection}
                    onPress={() => this.testConnection()}
                  >
                    Connection ok!
                  </Button>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
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

Settings.propTypes = {
  navigation: PropTypes.any
};

const style = StyleSheet.create({
  logContainer: {
    flex: 0.1,
    alignItems: "flex-end",
    padding: 10
  },
  container: {
    padding: 30,
    backgroundColor: "white",
    flex: 0.8,
    paddingTop: 30
  },
  dividerStyle: {
    backgroundColor: "transparent",
    borderBottomColor: "#6200ee",
    borderBottomWidth: 3,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20
  },
  form: {
    flex: 1
  },
  login: {
    flex: 0.5,
    justifyContent: "center",
    padding: 30,
    paddingTop: 30
  }
});

export default Settings;

import React, { Component } from "react";

import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

import AsyncStorage from "@react-native-community/async-storage";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import PropTypes from "prop-types";
import { Input, Icon } from "react-native-elements";

import MSSQL from "react-native-mssql";

import testConnection from "./testConnection";
import BottomMessage from "../Layout/Alert/bottomMessage";
import { EventEmitter } from "events";

class Settings extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isTesting: false,
      connSuccessful: null,
      message: null
    };
    this._emitter = new EventEmitter();
  }

  async provokeError() {
    try {
      test = ["article", "test"];
      for (let i = 0; i < test.length + 3; i++) {
        console.log(test[i].name);
      }
    } catch (e) {
      errors = await AsyncStorage.getItem("logs");

      if (!errors) {
        errors = [{ date: new Date().toLocaleString(), error: e.message }];

        AsyncStorage.setItem("logs", JSON.stringify(errors));
      } else {
        errors = JSON.parse(errors);
        errors.push({ date: new Date().toLocaleString(), error: e.message });

        AsyncStorage.setItem("logs", JSON.stringify(errors));
      }
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
          console.log(err);
          this.setState(
            {
              isTesting: false,
              connSuccessful: false,
              message: "Error while connecting to the remote database."
            },
            () => {
              this._emitter.emit("trigger-message");
            }
          );
        });
    });
  }

  render() {
    return (
      <>
        <View style={{ flex: 0.9 }}>
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
                placeholder="Name"
                name="Name"
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
            </View>
            <View style={style.login}>
              <TouchableOpacity>
                {!this.state.connSuccessful ? (
                  <Button
                    mode="contained"
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
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Button
            onPress={() => this.provokeError()}
            mode="contained"
            color="red"
          >
            Error
          </Button>
        </View>

        <BottomMessage
          msg={this.state.message}
          error={true}
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
    flex: 0.2,
    alignItems: "flex-end",
    padding: 10
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 30,
    backgroundColor: "white",
    paddingTop: 80
  },
  dividerStyle: {
    backgroundColor: "transparent",
    borderBottomColor: "#6200ee",
    borderBottomWidth: 3,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20
  },
  form: {
    flex: 0.7
  },
  login: {
    flex: 0.3
  }
});

export default Settings;

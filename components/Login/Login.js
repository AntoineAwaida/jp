import React, { Component } from "react";

import { View, Text, StyleSheet } from "react-native";
import { Input, Icon } from "react-native-elements";
import { Button, ActivityIndicator } from "react-native-paper";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DB } from "../../database/database";

import { EventEmitter } from "events";
import BottomMessage from "../Layout/Alert/bottomMessage";

import PropTypes from "prop-types";

import AsyncStorage from "@react-native-community/async-storage";
import logError from "../Settings/logError";

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: null,
      password: null,
      error: false,
      message: null,
      isLoading: false,
      isRetrievingUser: true
    };
    this._emitter = new EventEmitter();
    this._emitter.setMaxListeners(0);
  }

  async componentDidMount() {
    const user = await AsyncStorage.getItem("user");

    user
      ? this.props.navigation.navigate(
          JSON.parse(user).Code_Groupe === "ADMIN" ||
            JSON.parse(user).name === "Admin"
            ? "MainAdmin"
            : "Main"
        )
      : this.setState({ isRetrievingUser: false });
  }

  changeUsername(e) {
    this.setState({ username: e, error: false });
  }
  changePassword(e) {
    this.setState({ password: e, error: false });
  }

  async _fillAsyncStorage(data) {
    const tournee = {
      Code: Date.now(),
      DateDebut: new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")
    };
    await AsyncStorage.setItem("user", JSON.stringify(data));
    await AsyncStorage.setItem("tournee", JSON.stringify(tournee));
  }

  async _login() {
    this.setState({ isLoading: true }, () => {
      this.state.username !== "Admin"
        ? DB.getDatabase()
            .then(db => {
              db.transaction(tx => {
                tx.executeSql(
                  `SELECT Nom, Code_Utilisateur, Code_Groupe FROM zz_Util WHERE Nom = ? `,
                  [this.state.username],
                  async (tx, results) => {
                    if (results.rows.length > 0) {
                      await this._fillAsyncStorage(results.rows.item(0));
                      this.setState({ isLoading: false });
                      this.props.navigation.navigate(
                        results.rows.item(0).Code_Groupe === "ADMIN"
                          ? "MainAdmin"
                          : "Main"
                      );
                    } else {
                      this.setState(
                        {
                          error: true,
                          isLoading: false,
                          message: "Wrong username or password!"
                        },
                        () => {
                          this._emitter.emit("trigger-message");
                        }
                      );
                    }
                  }
                );
              });
            })
            .catch(err => {
              logError(err);
              this.setState({
                isLoading: false,
                error: true,
                message: "Unable to access the database."
              });
            })
        : this.state.password === "ecbxv"
        ? this._fillAsyncStorage({ name: "Admin" }).then(() => {
            this.setState({ isLoading: false }, () => {
              this.props.navigation.navigate("MainAdmin");
            });
          })
        : this.setState(
            {
              error: true,
              isLoading: false,
              message: "Wrong username or password!"
            },
            () => {
              this._emitter.emit("trigger-message");
            }
          );
    });
  }

  render() {
    return this.state.isRetrievingUser ? (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <>
        <View style={style.container}>
          <View style={style.form}>
            <Input
              onChangeText={e => this.changeUsername(e)}
              placeholder="Name"
              name="Name"
              clearTextOnFocus={true}
              inputContainerStyle={style.dividerStyle}
              textContentType="username"
              placeholderTextColor="#eaeaea"
              selectionColor="grey"
              inputStyle={{ color: "white", marginLeft: 15 }}
              leftIcon={
                <Icon type="font-awesome" name="user" size={20} color="white" />
              }
            />
            <Input
              onChangeText={e => this.changePassword(e)}
              shake={true}
              name="password"
              placeholder="Password"
              clearTextOnFocus={true}
              inputContainerStyle={style.dividerStyle}
              inputStyle={{ color: "white", marginLeft: 10 }}
              placeholderTextColor="#eaeaea"
              secureTextEntry={true}
              textContentType="password"
              leftIcon={<FontAwesome5 name="key" size={20} color="white" />}
            />
          </View>
          <View style={style.login}>
            <TouchableOpacity>
              <Button
                loading={this.state.isLoading}
                onPress={() => this._login()}
                mode="contained"
              >
                Login
              </Button>
            </TouchableOpacity>
          </View>
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

Login.propTypes = {
  navigation: PropTypes.any
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 30,
    backgroundColor: "#571db2",
    paddingTop: 80
  },
  dividerStyle: {
    backgroundColor: "transparent",
    borderBottomColor: "white",
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

export default Login;

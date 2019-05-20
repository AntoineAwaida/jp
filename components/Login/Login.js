import React, { Component } from "react";

import { View, Text, StyleSheet } from "react-native";
import { Input, Icon } from "react-native-elements";
import { Button, ActivityIndicator } from "react-native-paper";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DB } from "../../database/database";

import EventEmitter from "events";
import BottomMessage from "../Layout/Alert/bottomMessage";

import PropTypes from "prop-types";

import AsyncStorage from "@react-native-community/async-storage";

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: null,
      error: false,
      message: null,
      isLoading: false,
      isRetrievingUser: true
    };
    this._emitter = new EventEmitter();
  }

  async componentDidMount() {
    const user = await AsyncStorage.getItem("user");

    user
      ? this.props.navigation.navigate(
          JSON.parse(user).Code_Groupe === "ADMIN" ? "MainAdmin" : "Main"
        )
      : this.setState({ isRetrievingUser: false });
  }

  changeUsername(e) {
    this.setState({ username: e, error: false });
  }

  async _fillAsyncStorage(data) {
    await AsyncStorage.setItem("user", JSON.stringify(data));
  }

  async _login() {
    this.setState({ isLoading: true }, () => {
      DB.getDatabase()
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
                      message: "Wrong username!"
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
          console.log(err);
          this.setState({
            isLoading: false,
            error: true,
            message: "Unable to access the database."
          });
        });
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

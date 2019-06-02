import React, { Component } from "react";

import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import PropTypes from "prop-types";
import sync from "./syncDB";

import SyncModal from "./SyncModal";
import logError from "../Settings/logError";

import { EventEmitter } from "events";

class Sync extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      syncMsg: "Establishing connection..."
    };
    this._emitter = new EventEmitter();
  }

  componentDidMount() {
    this._emitter.on("pull", () => {
      this.setState({ syncMsg: "Connection successful, pulling data..." });
    });
    this._emitter.on("push", () => {
      this.setState({ syncMsg: "Pushing orders to remote DB..." });
    });
    this._emitter.on("drop", () => {
      this.setState({ syncMsg: "Dropping local data..." });
    });
    this._emitter.on("save", () => {
      this.setState({ syncMsg: "Saving new data..." });
    });
    this._emitter.on("success", () => {
      this.setState({ syncMsg: "Sync succeeded!" });
    });
    this._emitter.on("fail", () => {
      this.setState({ syncMsg: "Sync failed." });
    });
  }

  async sync() {
    try {
      this.setState({ isLoading: true, syncModal: true });
      const results = await sync(this._emitter);
      console.log(results);
    } catch (e) {
      await logError(e);
      console.log(e);
    } finally {
      this.setState({ isLoading: false, syncModal: false });
    }
  }

  render() {
    return (
      <>
        <SyncModal msg={this.state.syncMsg} isVisible={this.state.syncModal} />

        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 0.85,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <FontAwesome5 name="sync-alt" size={80} color="#571db2" />
            <TouchableOpacity>
              <Button
                loading={this.state.isLoading}
                style={{ marginTop: 50 }}
                color="#571db2"
                onPress={() => this.sync()}
                mode="contained"
              >
                Sync
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

Sync.propTypes = {
  navigation: PropTypes.any
};

export default Sync;

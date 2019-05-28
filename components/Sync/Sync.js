import React, { Component } from "react";

import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import PropTypes from "prop-types";
import sync from "./syncDB";

import SyncModal from "./SyncModal";
import logError from "../Settings/logError";

class Sync extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false
    };
  }

  async sync() {
    try {
      this.setState({ isLoading: true, syncModal: true });
      const results = await sync();
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
        <SyncModal isVisible={this.state.syncModal} />

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

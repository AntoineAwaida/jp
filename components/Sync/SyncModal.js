import Modal from "react-native-modal";

import React, { Component } from "react";

import { View } from "react-native";

import PropTypes from "prop-types";
import { Text } from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";

class SyncModal extends Component {
  render() {
    return (
      <Modal style={{ flex: 1 }} isVisible={this.props.isVisible}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text h3 style={{ color: "white", textAlign: "center" }}>
            {this.props.msg}
          </Text>
          <Text> </Text>
          <ActivityIndicator size="large" color="white" />
        </View>
      </Modal>
    );
  }
}

SyncModal.propTypes = {
  isVisible: PropTypes.bool,
  msg: PropTypes.string
};

export default SyncModal;

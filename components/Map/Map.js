import React, { Component } from "react";

import { View, Text } from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";

export default class Map extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isModalVisible: false
    };
  }

  toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button title="Show modal" onPress={() => this.toggleModal()} />
        <Modal isVisible={this.state.isModalVisible}>
          <View style={{ flex: 1 }}>
            <Text>Hello!</Text>
            <Button title="Hide modal" onPress={() => this.toggleModal()} />
          </View>
        </Modal>
      </View>
    );
  }
}

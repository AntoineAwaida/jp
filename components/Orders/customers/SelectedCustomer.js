import React, { Component } from "react";

import { View } from "react-native";

import { Text } from "react-native-elements";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { TouchableOpacity } from "react-native-gesture-handler";

import PropTypes from "prop-types";

class SelectedCustomer extends Component {
  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flex: 0.8,
            alignItems: "center"
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <FontAwesome5 name="user" size={30} solid />
            <Text h4 style={{ marginLeft: 5 }}>
              {this.props.customer.RaisonSociale}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <FontAwesome5 name="phone" />
            <Text style={{ marginLeft: 5 }}>
              {this.props.customer.TelFacturation}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <FontAwesome5 name="truck-moving" />
            <Text style={{ marginLeft: 5 }}>
              {this.props.customer.AdrLivraison1}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0.2,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity onPress={() => this.props.cancelCustomer()}>
            <FontAwesome5 name="times-circle" solid color="red" size={40} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

SelectedCustomer.propTypes = {
  cancelCustomer: PropTypes.func,
  customer: PropTypes.object
};

export default SelectedCustomer;

import React, { Component } from "react";
import Modal from "react-native-modal";
import { Button, Text, Input } from "react-native-elements";

import { View } from "react-native";

import PropTypes from "prop-types";

import _ from "lodash";

function isNormalInteger(str) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n != 0;
}

class BasketModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      search: null,
      errorQuantity: false,
      quantity: null,
      article: null
    };
  }

  componentDidMount() {
    this.props.ee.on("selectArticle", article => {
      this.setState({ article: article });
    });
  }

  handleQuantity = e => {
    if (isNormalInteger(e)) {
      this.setState({ quantity: e, errorQuantity: false });
    } else {
      this.setState({ quantity: null, errorQuantity: true });
    }
  };

  chooseArticle() {
    const article = { ...this.state.article, quantity: this.state.quantity };
    this.props.toggleBasketModal(article);
  }

  render() {
    return (
      <Modal isVisible={this.props.isVisible}>
        <View
          style={{
            flex: 0.7,
            backgroundColor: "white",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
          }}
        >
          <Text h2 style={{ textAlign: "center", color: "black" }}>
            Add an article
          </Text>
          <Text h4 style={{ textAlign: "center" }}>
            {this.state.article && this.state.article.Designation}
          </Text>
          <View
            style={{
              flex: 0.9,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <View style={{ flex: 1 }} />
            <View style={{ flex: 2 }}>
              <Input
                placeholder="quantity..."
                onChangeText={e => this.handleQuantity(e)}
                errorMessage={
                  this.state.errorQuantity
                    ? "Please enter a numerical value, different from 0."
                    : null
                }
              />
              <Text>
                {"\n"}
                Remaining:{" "}
                {this.state.article &&
                  this.state.article.StockDepot - this.state.quantity}
              </Text>
            </View>
            <View style={{ flex: 1 }} />
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Button
              disabled={
                this.state.errorQuantity || !this.state.quantity ? true : false
              }
              buttonStyle={{ backgroundColor: "green" }}
              title="OK"
              onPress={() => this.chooseArticle()}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Close"
              buttonStyle={{ backgroundColor: "red" }}
              onPress={() => this.props.toggleBasketModal()}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

BasketModal.propTypes = {
  isVisible: PropTypes.bool,
  toggleBasketModal: PropTypes.func,
  article: PropTypes.any,
  ee: PropTypes.any
};

export default BasketModal;

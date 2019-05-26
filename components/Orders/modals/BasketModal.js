import React, { Component } from "react";
import Modal from "react-native-modal";
import { Button, Text, Input } from "react-native-elements";

import { View } from "react-native";

import PropTypes from "prop-types";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import _ from "lodash";
import { TouchableOpacity } from "react-native-gesture-handler";

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
    this.boundSelectArticle = e => this.selectArticle(e);
  }

  selectArticle(article) {
    this.setState({ article: article });
  }

  componentDidMount() {
    this.props.ee.on("selectArticle", this.boundSelectArticle);
  }

  componentWillUnmount() {
    let boundSelectArticle = this.boundSelectArticle;
    this.props.ee.removeListener("selectArticle", boundSelectArticle);
  }

  handleQuantity = e => {
    if (isNormalInteger(e)) {
      this.setState({ quantity: parseInt(e), errorQuantity: false });
    } else {
      this.setState({ quantity: null, errorQuantity: true });
    }
  };

  chooseArticle() {
    const article = { ...this.state.article, quantity: this.state.quantity };
    this.setState({ quantity: null }, () => {
      this.props.toggleBasketModal(article);
    });
  }

  incQuantity() {
    if (this.state.quantity) {
      this.setState({ quantity: this.state.quantity + 1 }, () => {
        this.state.quantity;
      });
    }
  }

  decQuantity() {
    if (this.state.quantity) {
      this.setState({ quantity: this.state.quantity - 1 }, () => {
        this.state.quantity;
      });
    }
  }

  closeModal() {
    this.setState({ quantity: null }, () => this.props.toggleBasketModal());
  }

  render() {
    return (
      <Modal isVisible={this.props.isVisible}>
        <View
          style={{
            flex: 0.7,
            backgroundColor: "white",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          }}
        >
          <View>
            <Text h3 style={{ textAlign: "center", color: "black" }}>
              Add an article
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                fontFamily: "Roboto-Thin"
              }}
            >
              {this.state.article && this.state.article.Designation}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-end",
              flex: 0.4
            }}
          >
            <TouchableOpacity
              onPress={() => this.incQuantity()}
              style={{ marginRight: 20 }}
            >
              <View>
                <FontAwesome5
                  onPress={() => this.incQuantity()}
                  color="#6200ee"
                  size={30}
                  name="plus"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.decQuantity()}
              style={{ marginLeft: 20 }}
            >
              <FontAwesome5
                onPress={() => this.decQuantity()}
                color="grey"
                size={30}
                name="minus"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 0.6,
              marginTop: 20,
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <View style={{ flex: 1 }} />
            <View style={{ flex: 2 }}>
              <Input
                value={this.state.quantity && this.state.quantity.toString()}
                keyboardType="numeric"
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
              buttonStyle={{ backgroundColor: "#6200ee", borderRadius: 0 }}
              title="OK"
              onPress={() => this.chooseArticle()}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Close"
              buttonStyle={{ backgroundColor: "grey", borderRadius: 0 }}
              onPress={() => this.closeModal()}
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

import React, { Component } from "react";

import { View, StyleSheet, Alert } from "react-native";

import PropTypes from "prop-types";

import { SafeAreaView } from "react-navigation";

import { SearchBar, Button, Icon, ListItem, Text } from "react-native-elements";

import _ from "lodash";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
  ScrollView,
  TouchableOpacity,
  FlatList
} from "react-native-gesture-handler";
import CustomerModal from "./modals/CustomerModal";
import BasketModal from "./modals/BasketModal";
import Checkout from "./layouts/Checkout";
import ArticlesList from "./layouts/articles/ArticlesList";
import ArticlesPick from "./layouts/articles/ArticlesPick";

const EventEmitter = require("events");

class Orders extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isCustomerModalVisible: false,
      isBasketModalVisible: false,
      customer: null,
      article: null,
      articles: [],
      ee: new EventEmitter()
    };
    this.toggleCustomerModal.bind(this);
    this.toggleBasketModal.bind(this);
    this.deleteArticle.bind(this);
  }

  deleteArticle(article) {
    this.setState(state => {
      const articles = state.articles.filter((item, j) => article !== item);
      return {
        articles
      };
    });
  }

  toggleBasketModal(article) {
    article
      ? this.setState({
          isBasketModalVisible: !this.state.isBasketModalVisible,
          articles: [...this.state.articles, article]
        })
      : this.setState({
          isBasketModalVisible: !this.state.isBasketModalVisible
        });
  }

  toggleCustomerModal(customer) {
    this.setState({
      isCustomerModalVisible: !this.state.isCustomerModalVisible,
      customer: customer ? customer : null
    });
  }

  cancelCustomer() {
    Alert.alert(
      "Delete customer selection?",
      "Are you sure you want to cancel your customer selection?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => this.setState({ customer: null, articles: [] })
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    return (
      <SafeAreaView style={style.contain}>
        <CustomerModal
          isVisible={this.state.isCustomerModalVisible}
          toggleCustomerModal={e => this.toggleCustomerModal(e)}
        />
        <BasketModal
          article={this.state.article}
          isVisible={this.state.isBasketModalVisible}
          ee={this.state.ee}
          toggleBasketModal={e => this.toggleBasketModal(e)}
        />
        <View style={style.customerContainer}>
          {this.state.customer ? (
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
                    {this.state.customer.RaisonSociale}
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
                    {this.state.customer.TelFacturation}
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
                    {this.state.customer.AdrLivraison1}
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
                <TouchableOpacity onPress={() => this.cancelCustomer()}>
                  <FontAwesome5
                    name="times-circle"
                    solid
                    color="red"
                    size={40}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={{ flex: 0.33 }}>
                <Text>Select a customer.</Text>
              </View>

              <View
                style={{
                  flex: 0.67,
                  justifyContent: "space-evenly",
                  flexDirection: "row"
                }}
              >
                <View>
                  <Button
                    icon={<Icon name="search" size={27} color="white" />}
                    title=" Search"
                    onPress={() => this.toggleCustomerModal()}
                  />
                </View>
                <View>
                  <Button
                    title=" Create"
                    icon={
                      <FontAwesome5 name="user-plus" size={25} color="white" />
                    }
                  />
                </View>
              </View>
            </>
          )}
        </View>
        <View style={style.shoppingCardContainer}>
          <View style={style.listArticles}>
            <ArticlesList
              deleteArticle={e => this.deleteArticle(e)}
              articles={this.state.articles}
            />
          </View>
          <View style={style.pickArticles}>
            <ArticlesPick
              articles={this.state.articles}
              ee={this.state.ee}
              toggleBasketModal={e => this.toggleBasketModal(e)}
            />
          </View>
        </View>
        <View style={{ flex: 0.1 }}>
          <Checkout
            articles={this.state.articles}
            navigation={this.props.navigation}
            customer={this.state.customer}
          />
        </View>
      </SafeAreaView>
    );
  }
}

Orders.propTypes = {
  navigation: PropTypes.any
};

const style = StyleSheet.create({
  contain: {
    flex: 1,
    padding: 10
  },
  customerContainer: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center"
  },

  shoppingCardContainer: {
    flex: 0.9,
    flexDirection: "row"
  },
  listArticles: {
    flex: 0.4,
    marginRight: 10
  },
  pickArticles: {
    flex: 0.6
  }
});

export default Orders;

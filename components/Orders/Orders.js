import React, { Component } from "react";

import { View, StyleSheet, Alert, Keyboard, Animated } from "react-native";

import PropTypes from "prop-types";

import { SafeAreaView } from "react-navigation";

import { Text } from "react-native-elements";

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
import { DB } from "../../database/database";
import Customers from "./customers/Customers";

import SelectedCustomer from "./customers/SelectedCustomer";

const EventEmitter = require("events");

class Orders extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerLeft: params.articles && params.articles.length > 0 && (
        <FontAwesome5
          style={{ marginLeft: 10 }}
          color="#6200ee"
          name="shopping-cart"
          size={30}
          onPress={() =>
            navigation.navigate("ArticlesList", {
              articles: params.articles,
              ee: params.ee
            })
          }
        />
      ),
      headerRight: (
        <FontAwesome5
          style={{ marginRight: 20 }}
          color="#6200ee"
          name="history"
          size={30}
          onPress={() => navigation.navigate("ListOrders")}
        />
      )
    };
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isCustomerModalVisible: false,
      isBasketModalVisible: false,
      customer: null,
      article: null,
      articles: [],
      articlesPickOpacity: new Animated.Value(0),
      ee: new EventEmitter()
    };
    this.toggleCustomerModal.bind(this);
    this.toggleBasketModal.bind(this);

    this.clearOffer.bind(this);
    this.cancelCustomer = this.cancelCustomer.bind(this);
    this.selectCustomer = this.selectCustomer.bind(this);
  }

  clearOffer() {
    this.setState({ customer: null, articles: [] });
  }

  listenKeyboard() {
    this.keyboardDidShowlistener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        this.state.ee.emit("keyboardUp");
      }
    );

    this.keyboardDidHidelistener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        this.state.ee.emit("keyboardDown");
      }
    );
  }

  listenEvents() {
    this.state.ee.on("editArticles", articles => {
      this.setState({ articles });
    });

    this.state.ee.addListener("customerSelected", () => {
      this.setState({ articlesPickOpacity: new Animated.Value(0) }, () => {
        Animated.timing(this.state.articlesPickOpacity, {
          toValue: 1,
          duration: 1000
        }).start();
      });
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowlistener.remove();
    this.keyboardDidHidelistener.remove();
  }

  componentDidMount() {
    this.listenKeyboard();
    this.listenEvents();

    const { articles, ee } = this.state;
    this.props.navigation.setParams({ articles, ee });

    navigator.geolocation.getCurrentPosition(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );

    //insérer un article...
    // DB.getDatabase().then(db =>
    //   db.transaction(tx => {
    //     tx.executeSql(
    //       `INSERT INTO ArticleDepot VALUES ('305408 0007616', '50') `
    //     );
    //     tx.executeSql(
    //       `INSERT INTO ArticleDepot VALUES ('305408 0053323', '50') `
    //     );
    //     tx.executeSql(
    //       `INSERT INTO ArticleDepot VALUES ('305832 0005028', '50') `
    //     );
    //     tx.executeSql(
    //       `INSERT INTO ArticleDepot VALUES ('305832 0010152', '50') `
    //     );
    //   })
    // );
    //pour supprimer les commandes...
    // DB.getDatabase().then(db => {
    //   db.transaction(tx => {
    //     tx.executeSql(`DELETE FROM pct_COMMANDE`);
    //     tx.executeSql("DELETE FROM pct_COMMANDEcomposition");
    //   });
    // });
  }

  toggleBasketModal(article) {
    article
      ? this.setState(
          {
            isBasketModalVisible: !this.state.isBasketModalVisible,
            articles: [...this.state.articles, article]
          },
          () => {
            const { articles } = this.state;
            this.props.navigation.setParams({ articles });
          }
        )
      : this.setState(
          {
            isBasketModalVisible: !this.state.isBasketModalVisible
          },
          () => {
            const { articles } = this.state;
            this.props.navigation.setParams({ articles });
          }
        );
  }

  selectCustomer(customer) {
    this.setState({ customer: customer });
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
          onPress: () =>
            this.setState({ customer: null, articles: [] }, () => {
              this.props.navigation.setParams({
                articles: this.state.articles
              });
            })
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    console.log(this.state._keyboardShown);
    return (
      <SafeAreaView style={style.contain}>
        <BasketModal
          article={this.state.article}
          isVisible={this.state.isBasketModalVisible}
          ee={this.state.ee}
          toggleBasketModal={e => this.toggleBasketModal(e)}
        />

        {!this.state.customer ? (
          <View style={style.selectCustomercontainer}>
            <View style={{ flex: 0.1, justifyContent: "center" }}>
              <Text style={{ fontSize: 20, color: "white" }}>
                Select a customer.
              </Text>
            </View>

            <View
              style={{
                flex: 1,

                flexDirection: "row"
              }}
            >
              <Customers
                emitter={this.state.ee}
                selectCustomer={this.selectCustomer}
              />
              {/* <View style={{ flex: 0.5 }}>
                  <Button
                    icon={<Icon name="search" size={27} color="white" />}
                    title=" Search"
                    onPress={() => this.toggleCustomerModal()}
                  />
                </View>
                <View style={{ flex: 0.5 }}>
                  <Button
                    title=" Create"
                    icon={
                      <FontAwesome5 name="user-plus" size={25} color="white" />
                    }
                  />
                </View> */}
            </View>
          </View>
        ) : (
          <Animated.View
            style={{ flex: 1, opacity: this.state.articlesPickOpacity }}
          >
            <View style={style.selectCustomercontainer}>
              <View style={style.customerContainer}>
                <SelectedCustomer
                  customer={this.state.customer}
                  cancelCustomer={this.cancelCustomer}
                />
              </View>
              <View style={style.shoppingCardContainer}>
                {/* <View style={style.listArticles}>
                <ArticlesList
                  deleteArticle={e => this.deleteArticle(e)}
                  articles={this.state.articles}
                />
              </View> */}
                <View style={style.pickArticles}>
                  <ArticlesPick
                    articles={this.state.articles}
                    ee={this.state.ee}
                    toggleBasketModal={e => this.toggleBasketModal(e)}
                  />
                </View>
              </View>
            </View>
            {
              <View style={{ flex: 0.1 }}>
                <Checkout
                  emitter={this.state.ee}
                  clearOffer={() => this.clearOffer()}
                  articles={this.state.articles}
                  navigation={this.props.navigation}
                  customer={this.state.customer}
                />
              </View>
            }
          </Animated.View>
        )}
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
    backgroundColor: "rgba(98, 0, 238, .8)"
  },
  customerContainer: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center"
  },

  shoppingCardContainer: {
    flex: 0.9
  },
  listArticles: {
    marginRight: 10
  },
  pickArticles: {
    flex: 1
  },
  selectCustomercontainer: {
    flex: 0.9
  }
});

export default Orders;

import React, { Component } from "react";
import Modal from "react-native-modal";

import { View, Text } from "react-native";
import { SearchBar, ListItem, Button } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";

import PropTypes from "prop-types";
import { DB } from "../../../database/database";
import { ActivityIndicator } from "react-native-paper";

class Customers extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      matchingCustomers: [],
      isLoading: false,
      search: null
    };
    this.tiemout = 0;
  }

  selectCustomer(customer) {
    this.props.emitter.emit("customerSelected");
    this.props.selectCustomer(customer);
  }

  getCustomers(text) {
    this.setState({ search: text });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (text.length > 1) {
        const searchtext = text.replace(/'/g, "&quot;");
        this.setState({ isLoading: true }, () => {
          DB.getDatabase().then(db => {
            db.transaction(tx => {
              tx.executeSql(
                `SELECT * FROM CLIENT WHERE RaisonSociale LIKE '%${searchtext}%'`,
                [],
                (tx, results) => {
                  let data = [];
                  for (let i = 0; i < results.rows.length; i++) {
                    data.push(results.rows.item(i));
                  }
                  this.setState({ matchingCustomers: data, isLoading: false });
                }
              );
            });
          });
        });
      } else {
        this.setState({ matchingCustomers: [] });
      }
    }, 400);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          inputContainerStyle={{ backgroundColor: "white", borderRadius: 50 }}
          containerStyle={{
            backgroundColor: "transparent",
            borderBottomColor: "transparent",
            borderTopColor: "transparent"
          }}
          placeholder="Search..."
          onChangeText={text => this.getCustomers(text)}
          value={this.state.search}
          showLoading={this.state.isLoading}
        />

        <View style={{ justifyContent: "center" }}>
          {this.state.isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              contentContainerStyle={{ borderRadius: 20 }}
              keyExtractor={item => item.Code_Client}
              data={this.state.matchingCustomers}
              renderItem={({ item }) => (
                <ListItem
                  titleStyle={{ textAlign: "center" }}
                  key={item.Code_Client}
                  title={item.RaisonSociale}
                  onPress={() => this.selectCustomer(item)}
                />
              )}
            />
          )}
        </View>
      </View>
    );
  }
}

Customers.propTypes = {
  selectCustomer: PropTypes.any,
  emitter: PropTypes.any
};

export default Customers;

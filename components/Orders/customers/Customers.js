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
  }

  getCustomers(text) {
    this.setState({ isLoading: true, search: text }, () => {
      DB.getDatabase().then(db => {
        db.transaction(tx => {
          tx.executeSql(
            `SELECT * FROM CLIENT WHERE RaisonSociale LIKE '%${text}%'`,
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
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          lightTheme
          round
          containerStyle={{ backgroundColor: "white" }}
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
              keyExtractor={item => item.Code_Client}
              data={this.state.matchingCustomers}
              renderItem={({ item }) => (
                <ListItem
                  key={item.Code_Client}
                  title={item.RaisonSociale}
                  onPress={() => this.props.selectCustomer(item)}
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
  selectCustomer: PropTypes.any
};

export default Customers;

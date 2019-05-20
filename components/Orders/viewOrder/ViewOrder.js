import React, { Component } from "react";

import { View } from "react-native";

import { Text, ListItem } from "react-native-elements";

import PropTypes from "prop-types";
import { DB } from "../../../database/database";
import { ActivityIndicator } from "react-native-paper";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { FlatList } from "react-native-gesture-handler";

export default class ViewOrder extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      commande: null,
      isLoading: true
    };
  }

  componentDidMount() {
    DB.getDatabase().then(db => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT p.DateCreation, p.Code_Commande,p.MontantAcompte, c.RaisonSociale FROM pct_COMMANDE AS p JOIN CLIENT AS c ON p.Code_Client = c.Code_Client WHERE p.Code_Commande = ?`,
          [this.props.navigation.state.params.Code_Commande],
          (tx, results) => {
            this.setState({ commande: results.rows.item(0) });
          }
        );
        tx.executeSql(
          "SELECT t.Quantite, a.Code_Article, t.PrixUnitaire, a.Designation FROM pct_COMMANDEcomposition AS t JOIN Article AS a ON t.Code_Article = a.Code_Article WHERE t.Code_Commande = ?",
          [this.props.navigation.state.params.Code_Commande],
          (tx, results) => {
            let data = [];
            for (let i = 0; i < results.rows.length; i++) {
              data.push(results.rows.item(i));
            }
            this.setState({ composition: data, isLoading: false });
          }
        );
      });
    });
  }

  render() {
    return this.state.isLoading ? (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <View style={{ flex: 1 }}>
        <View>
          <Text style={{ textAlign: "center", color: "#571db2" }} h3>
            {"Order #" + this.state.commande.Code_Commande}
          </Text>
        </View>
        <View style={{ flexDirection: "row", margin: 10 }}>
          <FontAwesome5
            solid
            style={{
              textAlignVertical: "center",
              marginLeft: 10,
              marginRight: 10
            }}
            name="clock"
          />
          <Text style={{ fontSize: 17 }}>
            Created at : {this.state.commande.DateCreation}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", marginLeft: 10, marginBottom: 20 }}
        >
          <FontAwesome5
            solid
            style={{
              textAlignVertical: "center",
              marginLeft: 10,
              marginRight: 10
            }}
            name="user"
          />
          <Text style={{ fontSize: 17 }}>
            Client: {this.state.commande.RaisonSociale}
          </Text>
        </View>
        <View style={{ flex: 0.8 }}>
          <FlatList
            keyExtractor={item => item.Code_Article.toString()}
            data={this.state.composition}
            sty
            renderItem={({ item }) => (
              <ListItem
                rightElement={
                  <FontAwesome5 name="dollar-sign">
                    <Text>{item.Quantite * item.PrixUnitaire}</Text>
                  </FontAwesome5>
                }
                key={item.Code_Article}
                title={item.Designation}
                containerStyle={{ backgroundColor: "#f5f5f5" }}
                subtitle={"Quantity: " + item.Quantite}
                subtitleStyle={{ fontWeight: "bold" }}
              />
            )}
          />
        </View>
        <View
          style={{
            flex: 0.1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text h4>Total amount : </Text>
          <FontAwesome5 name="dollar-sign" size={20} />
          <Text h4>{" " + this.state.commande.MontantAcompte}</Text>
        </View>
      </View>
    );
  }
}

ViewOrder.propTypes = {
  navigation: PropTypes.any
};

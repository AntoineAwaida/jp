import React, { useEffect, useState } from "react";
import { Text, Button } from "react-native-elements";

import { View, Alert, StyleSheet, Animated } from "react-native";

import PropTypes from "prop-types";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import save from "../saveOrder";
import { DB } from "../../../database/database";

function Checkout(props) {
  const [price, setPrice] = useState(0);
  const [code, setCode] = useState(0);

  const [bottomPosition, setbottomPosition] = useState(new Animated.Value(0));

  function saveOrder() {
    DB.getDatabase()
      .then(db => {
        db.transaction(tx => {
          tx.executeSql(
            `SELECT Code_Commande FROM pct_COMMANDE ORDER BY Code_Commande DESC limit 1`,
            [],
            (tx, results) => {
              let code_commande = 0;

              if (results.rows.length > 0) {
                code_commande = results.rows.item(0)["Code_Commande"] + 1;
                setCode(code_commande);
              }

              tx.executeSql(
                `INSERT INTO pct_COMMANDE(Code_Client, Code_Commande, DateCreation, MontantAcompte, nomPoste) VALUES (?, ?, ?, ?, ?)`,
                [
                  props.customer.Code_Client,
                  code_commande,
                  new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " "),
                  price,
                  "pp01"
                ]
              );
              props.articles.map((article, i) => {
                tx.executeSql(
                  `INSERT INTO pct_COMMANDEcomposition(Code_Commande, Code_Article, Quantite, PrixUnitaire, NumLigne, nomPoste) VALUES (?, ?, ?, ?, ?, ?)`,
                  [
                    code_commande,
                    article.Code_Article,
                    article.quantity,
                    article.PrixUnitaire,
                    i,
                    "pp01"
                  ]
                );
              });
              props.articles.map(article => {
                tx.executeSql(
                  `UPDATE ArticleDepot SET StockDepot=? WHERE Code_Article=?`,
                  [article.StockDepot - article.quantity, article.Code_Article]
                );
              });
            }
          );
        });
      })
      .then(() => {
        DB.getDatabase().then(db => {
          db.transaction(tx => {
            tx.executeSql(
              `SELECT Code_Commande FROM pct_COMMANDE ORDER BY Code_Commande DESC limit 1`,
              [],
              (tx, results) => {
                code_commande = results.rows.item(0)["Code_Commande"];
                props.navigation.navigate("ViewOrder", {
                  Code_Commande: code_commande
                });
                props.clearOffer();
              }
            );
          });
        });
      });
  }

  props.emitter.addListener("keyboardUp", () => {
    Animated.timing(bottomPosition, {
      toValue: -50,
      duration: 300
    }).start();
  });

  props.emitter.addListener("keyboardDown", () => {
    Animated.timing(bottomPosition, {
      toValue: 0,
      duration: 300
    }).start();
  });

  useEffect(() => {
    let total_price = 0;
    props.articles.map(article => {
      total_price += article.quantity * article.PrixUnitaire;
    });

    setPrice(total_price);
  });

  return (
    <Animated.View style={[styles.Container, { bottom: bottomPosition }]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 0.8,
          marginLeft: 10
        }}
      >
        <FontAwesome5 name="dollar-sign" size={25} color="green" />
        <Text style={{ color: "green" }} h3>
          {"  " + price}
        </Text>
      </View>
      <View style={{ flex: 0.4, justifyContent: "center" }}>
        <Button
          onPress={() => {
            props.customer && props.articles.length > 0
              ? saveOrder()
              : Alert.alert(
                  "Please select a client and at least an article in your basket."
                );
          }}
          icon={<FontAwesome5 name="shopping-cart" color="white" size={20} />}
          title="  Checkout"
          buttonStyle={{ backgroundColor: "green", marginRight: 10 }}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white"
  }
});

Checkout.propTypes = {
  articles: PropTypes.array,
  navigation: PropTypes.any,
  customer: PropTypes.any,
  clearOffer: PropTypes.func,
  emitter: PropTypes.any
};

export default Checkout;

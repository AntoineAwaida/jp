import React, { Component } from "react";

import { View } from "react-native";

import { Text, ListItem } from "react-native-elements";

import PropTypes from "prop-types";
import { DB } from "../../../database/database";
import { ActivityIndicator } from "react-native-paper";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { FlatList } from "react-native-gesture-handler";
import logError from "../../Settings/logError";
import BluetoothConn from "./BluetoothConn";
import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter
} from "react-native-bluetooth-escpos-printer";

import BottomMessage from "../../Layout/Alert/bottomMessage";

import { EventEmitter } from "events";

export default class ViewOrder extends Component {
  static navigationOptions = ({ navigation }) => {
    const bluetoothPrint = navigation.getParam("bluetoothPrint");
    const commande = navigation.getParam("commande");
    const composition = navigation.getParam("composition");
    return {
      headerRight: (
        <FontAwesome5
          style={{ marginRight: 20 }}
          color="#6200ee"
          name="print"
          size={30}
          onPress={() => bluetoothPrint(commande, composition)}
        />
      )
    };
  };

  async _bluetoothPrint(commande, composition) {
    try {
      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printerLeftSpace(0);

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER
      );
      await BluetoothEscposPrinter.setBlob(0);
      await BluetoothEscposPrinter.printText(
        "Order #" + commande.Code_Commande + "\r\n",
        {
          encoding: "UTF-8",
          codepage: 0,
          widthtimes: 3,
          heigthtimes: 3,
          fonttype: 1
        }
      );
      await BluetoothEscposPrinter.setBlob(0);
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT
      );
      await BluetoothEscposPrinter.printText(
        "Date ：" + commande.DateCreation + "\r\n",
        {}
      );
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT
      );
      await BluetoothEscposPrinter.printText(commande.RaisonSociale + "\r\n", {
        encoding: "ISO8859_6",
        codepage: 22
      });

      await BluetoothEscposPrinter.printText(
        "--------------------------------\r\n",
        {}
      );
      let columnWidths = [12, 6, 6, 8];
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT
        ],
        ["Article", "Quantity", "Price per unit", "Price"],
        {}
      );

      composition.map(async article => {
        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT
          ],
          [
            article.Designation.toString(),
            article.Quantite.toString(),
            article.PrixUnitaire.toString(),
            (
              Math.round(article.Quantite * article.PrixUnitaire * 100) / 100
            ).toString()
          ],
          {}
        );
      });

      await BluetoothEscposPrinter.printText("\r\n", {});
      await BluetoothEscposPrinter.printText(
        "--------------------------------\r\n",
        {}
      );
      await BluetoothEscposPrinter.printColumn(
        [20, 12],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ["Total price: ", commande.MontantAcompte.toString()],
        {}
      );

      await BluetoothEscposPrinter.printText("\r\n\r\n", {});

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER
      );
      await BluetoothEscposPrinter.printText(
        "Thank you for your visit! \r\n\r\n\r\n",
        {}
      );
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT
      );
      await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});
    } catch (e) {
      logError(e);
      this.setState(
        {
          error: true,
          message: "Error in printing. See log for details."
        },
        () => {
          this._emitter.emit("trigger-message");
        }
      );
    }
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      commande: null,
      isLoading: true,
      message: null,
      error: false
    };
    this._emitter = new EventEmitter();
  }

  componentDidMount() {
    this.props.navigation.setParams({ bluetoothPrint: this._bluetoothPrint });
    DB.getDatabase()
      .then(db => {
        db.transaction(tx => {
          tx.executeSql(
            `SELECT p.DateCreation, p.Code_Commande,p.MontantAcompte, p.ZoneN4, p.ZoneN5, c.RaisonSociale FROM pct_COMMANDE AS p JOIN CLIENT AS c ON p.Code_Client = c.Code_Client WHERE p.Code_Commande = ?`,
            [this.props.navigation.state.params.Code_Commande],
            (tx, results) => {
              this.setState({ commande: results.rows.item(0) }, () => {
                this.props.navigation.setParams({
                  commande: this.state.commande
                });
              });
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
              this.setState({ composition: data, isLoading: false }, () => {
                this.props.navigation.setParams({
                  composition: this.state.composition
                });
              });
            }
          );
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return this.state.isLoading ? (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.3 }}>
            <BluetoothConn />
          </View>
          <View style={{ flex: 1, borderTopColor: "grey", borderTopWidth: 4 }}>
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
              style={{ flexDirection: "row", marginLeft: 10, marginBottom: 10 }}
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
                name="globe"
              />
              <Text style={{ fontSize: 17 }}>
                GPS:{" "}
                {"N: " +
                  this.state.commande.ZoneN4 +
                  " / E: " +
                  this.state.commande.ZoneN5}
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
                        <Text>
                          {Math.round(item.Quantite * item.PrixUnitaire * 100) /
                            100}
                        </Text>
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
              <Text h4>
                {" " +
                  Math.round(this.state.commande.MontantAcompte * 100) / 100}
              </Text>
            </View>
          </View>
        </View>
        <BottomMessage
          msg={this.state.message}
          error={this.state.error}
          emitter={this._emitter}
        />
      </>
    );
  }
}

ViewOrder.propTypes = {
  navigation: PropTypes.any
};

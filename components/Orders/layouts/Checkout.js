import React, { useEffect, useState } from "react";
import { Text, Button } from "react-native-elements";

import { View, Alert } from "react-native";

import PropTypes from "prop-types";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

function Checkout(props) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    let total_price = 0;
    props.articles.map(article => {
      total_price += article.quantity * article.PrixUnitaire;
    });

    setPrice(total_price);
  });

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        borderTopWidth: 2,
        borderTopColor: "grey"
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 0.8 }}>
        <FontAwesome5 name="dollar-sign" size={25} color="green" />
        <Text style={{ color: "green" }} h3>
          {"  " + price}
        </Text>
      </View>
      <View style={{ flex: 0.4, justifyContent: "center" }}>
        <Button
          onPress={() => {
            props.customer && props.articles.length > 0
              ? props.navigation.navigate("ViewOrder")
              : Alert.alert(
                  "Please select a client and at least an article in your basket."
                );
          }}
          icon={<FontAwesome5 name="shopping-cart" color="white" size={20} />}
          title="  Checkout"
          buttonStyle={{ backgroundColor: "green" }}
        />
      </View>
    </View>
  );
}

Checkout.propTypes = {
  articles: PropTypes.array,
  navigation: PropTypes.any,
  customer: PropTypes.any
};

export default Checkout;

import React, { Component } from "react";

import { View, Text } from "react-native";

import PropTypes from "prop-types";
import { ListItem } from "react-native-elements";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default class ArticlesList extends Component {
  render() {
    return (
      <View>
        {this.props.articles.length === 0 ? (
          <Text>Select articles in the list.</Text>
        ) : (
          <View>
            <Text>Your order.</Text>
            {this.props.articles.map(item => (
              <ListItem
                key={item.Code_Article}
                title={item.Designation}
                subtitle={
                  "Quantity: " +
                  item.quantity +
                  "\nRemaining: " +
                  (item.StockDepot - item.quantity)
                }
                subtitleStyle={{ fontWeight: "bold" }}
                rightIcon={
                  <FontAwesome5
                    name="times"
                    size={30}
                    color="red"
                    onPress={() => {
                      this.props.deleteArticle(item);
                    }}
                  />
                }
              />
            ))}
          </View>
        )}
      </View>
    );
  }
}

ArticlesList.propTypes = {
  articles: PropTypes.array,
  deleteArticle: PropTypes.func
};

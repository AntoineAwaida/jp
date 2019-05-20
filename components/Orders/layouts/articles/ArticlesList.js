import React, { Component } from "react";

import { View, Text, Alert } from "react-native";

import PropTypes from "prop-types";
import { ListItem } from "react-native-elements";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { ActivityIndicator } from "react-native-paper";

export default class ArticlesList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      articles: null
    };
  }

  componentDidMount() {
    this.setState({ articles: this.props.navigation.state.params.articles });
  }

  deleteArticle(article) {
    Alert.alert(
      "Delete this article?",
      "Are you sure you want to remove this article?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            let articles = this.state.articles.filter(
              (item, j) => article !== item
            );

            this.setState({ articles: articles }, () => {
              this.props.navigation.state.params.ee.emit(
                "editArticles",
                articles
              );
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const { articles } = this.state;

    return this.state.articles ? (
      <View>
        {articles.length === 0 ? (
          <Text>Select articles in the list.</Text>
        ) : (
          <View>
            <Text>Your order.</Text>
            {articles.map(item => (
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
                  <View>
                    <FontAwesome5
                      name="pencil-alt"
                      size={25}
                      color="blue"
                      onPress={() => {
                        this.editArticle(item);
                      }}
                    />
                    <FontAwesome5
                      name="times"
                      size={30}
                      color="red"
                      onPress={() => {
                        this.deleteArticle(item);
                      }}
                    />
                  </View>
                }
              />
            ))}
          </View>
        )}
      </View>
    ) : (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

ArticlesList.propTypes = {
  navigation: PropTypes.any
};

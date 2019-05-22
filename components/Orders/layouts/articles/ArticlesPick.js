import React, { Component } from "react";

import { View, Text, StyleSheet } from "react-native";
import { DB } from "../../../../database/database";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import PropTypes from "prop-types";

import _ from "lodash";
import { ActivityIndicator } from "react-native-paper";
import { SearchBar } from "react-native-elements";

export default class ArticlesPick extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: true,
      availableArticles: [], //articles disponibles, càd présents dans ArticleDepot notamment.
      searchedArticles: [],
      search: ""
    };
    this.selectArticle.bind(this);
  }

  selectArticle(article) {
    this.props.ee.emit("selectArticle", article);
    this.props.toggleBasketModal();
  }

  searchArticle(text) {
    if (text.length > 0) {
      this.setState({ search: text });
      const searchedArticles = _.filter(this.state.availableArticles, function(
        o
      ) {
        return (
          o.Designation.toLowerCase().includes(text.toLowerCase()) ||
          o.Code_Article.includes(text)
        );
      });

      this.setState({ searchedArticles: searchedArticles });
    } else {
      this.setState({
        searchedArticles: this.state.availableArticles,
        search: text
      });
    }
  }

  async componentDidMount() {
    DB.getDatabase().then(db => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM (ArticleDepot AS d JOIN Article AS a 
                ON d.Code_Article = a.Code_Article) AS t 
                JOIN TARIFarticlePrix AS x
                ON t.Code_Article = x.Code_Article`,
          [],
          (tx, results) => {
            let data = [];
            for (let i = 0; i < results.rows.length; i++) {
              //on n'ajoute pas l'article aux résultats possibles s'il est déjà dans le panier
              data.push(results.rows.item(i));
            }

            this.setState({ availableArticles: data, isLoading: false }, () => {
              this.searchArticle("");
            });
          }
        );
      });
    });
  }
  render() {
    const colors = ["grey", "orange", "red", "green", "#571db2"];
    return (
      <ScrollView>
        <View>
          {this.state.isLoading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <SearchBar
                inputContainerStyle={{
                  backgroundColor: "white",
                  borderRadius: 50
                }}
                containerStyle={{
                  backgroundColor: "transparent",
                  borderBottomColor: "transparent",
                  borderTopColor: "transparent"
                }}
                placeholder="Search an article..."
                onChangeText={text => this.searchArticle(text)}
                value={this.state.search}
              />
              <View style={styles.list}>
                {this.state.searchedArticles.map((article, index) => (
                  <View style={styles.articleContainer} key={index}>
                    <View
                      style={[
                        styles.article,
                        {
                          opacity: _.find(this.props.articles, article)
                            ? 0.3
                            : 1,
                          backgroundColor: colors[index % colors.length]
                        }
                      ]}
                    >
                      <TouchableOpacity
                        disabled={
                          _.find(this.props.articles, article) ? true : false
                        }
                        onPress={() => this.selectArticle(article)}
                      >
                        <Text
                          style={{
                            color: "white",
                            textAlign: "center"
                          }}
                        >
                          {article.Designation}
                        </Text>
                        <Text
                          style={{
                            color: "white",
                            textAlign: "center"
                          }}
                        >
                          {article.Code_Article.slice(-4)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

ArticlesPick.propTypes = {
  toggleBasketModal: PropTypes.func,
  ee: PropTypes.any,
  articles: PropTypes.array
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  articleContainer: {
    height: 100,
    width: 100,
    padding: 5
  },
  article: {
    flex: 1,
    opacity: 1,
    justifyContent: "center",
    borderRadius: 5
  }
});

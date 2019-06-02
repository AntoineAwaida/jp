import { DB } from "../../../database/database";

export default function save_Article(tx, articles) {
  return articles.map(article => {
    let articleDepot = { StockDepot: article.StockDepot };

    articleDepot.Code_Article = article.Code_Article;

    delete article.StockDepot;

    let columns = "";
    Object.keys(article).map(column => {
      columns += column + ",";
    });
    columns = columns.substr(0, columns.length - 1);

    const query = "?,".repeat(Object.keys(article).length - 1) + "?";

    tx.executeSql(
      `INSERT INTO ARTICLE(${columns}) VALUES(${query})`,
      Object.values(article)
    );

    tx.executeSql(
      `INSERT INTO ARTICLEDepot(Code_Article,StockDepot) VALUES (?,?)`,
      [articleDepot.Code_Article, articleDepot.StockDepot]
    );
  });
}

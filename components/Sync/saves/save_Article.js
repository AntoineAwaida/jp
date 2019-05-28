import { DB } from "../../../database/database";

//répond trop vite - je voudrais retourner la valeur après la transaction!
export default function save_Article(articles) {
  return DB.getDatabase().then(db => {
    db.transaction(tx => {
      tx.executeSql(`BEGIN TRANSACTION`);
      articles.map(article => {
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
      tx.executeSql(`COMMIT`, []);
    });
  });
}

import { DB } from "../../../database/database";

//répond trop vite - je voudrais retourner la valeur après la transaction!
export default function save_TarifarticlePrix(tx, articles) {
  return articles.map((article, i) => {
    let columns = "";
    Object.keys(article).map(column => {
      columns += column + ",";
    });
    columns = columns.substr(0, columns.length - 1);

    const query = "?,".repeat(Object.keys(article).length - 1) + "?";

    tx.executeSql(
      `INSERT INTO TARIFarticlePrix(${columns}) VALUES(${query})`,
      Object.values(article)
    );
  });
}

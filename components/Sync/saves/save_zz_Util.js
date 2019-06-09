export default function save_zz_Util(tx, articles) {
  return articles.map((article, i) => {
    let columns = "";
    Object.keys(article).map(column => {
      columns += column + ",";
    });
    columns = columns.substr(0, columns.length - 1);

    const query = "?,".repeat(Object.keys(article).length - 1) + "?";

    tx.executeSql(
      `INSERT INTO zz_Util(${columns}) VALUES(${query})`,
      Object.values(article)
    );
  });
}

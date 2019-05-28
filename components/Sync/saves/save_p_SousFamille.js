import { DB } from "../../../database/database";

export default function save_p_SousFamille(items) {
  return DB.getDatabase().then(db => {
    db.transaction(tx => {
      tx.executeSql(`BEGIN TRANSACTION`);
      items.map((item, i) => {
        let columns = "";
        Object.keys(item).map(column => {
          columns += column + ",";
        });
        columns = columns.substr(0, columns.length - 1);

        const query = "?,".repeat(Object.keys(item).length - 1) + "?";

        tx.executeSql(
          `INSERT INTO p_SousFamille(${columns}) VALUES(${query})`,
          Object.values(item)
        );
      });
      tx.executeSql(`COMMIT`, []);
    });
  });
}

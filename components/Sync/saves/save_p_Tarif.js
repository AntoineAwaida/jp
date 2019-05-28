import { DB } from "../../../database/database";

//répond trop vite - je voudrais retourner la valeur après la transaction!
export default function save_p_Tarif(items) {
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
          `INSERT INTO p_Tarif(${columns}) VALUES(${query})`,
          Object.values(item)
        );
      });
      tx.executeSql(`COMMIT`, []);
    });
  });
}

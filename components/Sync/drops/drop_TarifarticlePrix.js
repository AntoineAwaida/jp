import { DB } from "../../../database/database";

export default function drop_Article() {
  return DB.getDatabase().then(db => {
    db.transaction(tx => {
      tx.executeSql(`DELETE FROM TARIFarticlePrix`);
    });
  });
}

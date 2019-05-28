import { DB } from "../../../database/database";

export default function drop_p_Tarif() {
  return DB.getDatabase().then(db => {
    db.transaction(tx => {
      tx.executeSql(`DELETE FROM pct_COMMANDEComposition`);
    });
  });
}

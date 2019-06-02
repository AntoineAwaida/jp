import { DB } from "../../../database/database";

export default function drop_Tournee(tx) {
  return tx.executeSql(`DELETE FROM Tournee`);
}

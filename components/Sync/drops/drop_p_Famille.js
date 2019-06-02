import { DB } from "../../../database/database";

export default function drop_p_Famille(tx) {
  return tx.executeSql(`DELETE FROM p_Famille`);
}

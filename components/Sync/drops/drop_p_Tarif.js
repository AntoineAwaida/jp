import { DB } from "../../../database/database";

export default function drop_p_Tarif(tx) {
  return tx.executeSql(`DELETE FROM p_Tarif`);
}

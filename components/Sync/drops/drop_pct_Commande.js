import { DB } from "../../../database/database";

export default function drop_pct_Commande(tx) {
  return tx.executeSql(`DELETE FROM pct_COMMANDE`);
}

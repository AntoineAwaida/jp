import { DB } from "../../../database/database";

export default function drop_pct_CommandeComposition(tx) {
  return tx.executeSql(`DELETE FROM pct_COMMANDEComposition`);
}

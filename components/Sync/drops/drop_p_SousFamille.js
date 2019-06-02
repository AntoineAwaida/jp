import { DB } from "../../../database/database";

export default function drop_p_SousFamille(tx) {
  return tx.executeSql(`DELETE FROM p_SousFamille`);
}

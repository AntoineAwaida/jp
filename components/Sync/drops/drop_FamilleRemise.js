import { DB } from "../../../database/database";

export default function drop_FamilleRemise(tx) {
  return tx.executeSql(`DELETE FROM FamilleRemise`);
}

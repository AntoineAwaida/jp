import { DB } from "../../../database/database";

export default function drop_Client(tx) {
  return tx.executeSql(`DELETE FROM CLIENT`);
}

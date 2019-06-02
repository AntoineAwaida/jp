import { DB } from "../../../database/database";

export default function drop_TarifarticlePrix(tx) {
  return tx.executeSql(`DELETE FROM TARIFarticlePrix`);
}

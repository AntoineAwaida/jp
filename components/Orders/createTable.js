import { DB } from "../../database/database";

export default function createTable() {
  DB.getDatabase().then(db =>
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE Tournee
        (
            Code INT PRIMARY KEY NOT NULL,
            DateDebut VARCHAR(100),
            Code_PocketPC VARCHAR(4),
            HeureFin VARCHAR(100)

        )`
      );
    })
  );
}

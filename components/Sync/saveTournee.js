import { DB } from "../../database/database";

export default function saveTournee(tournee) {
  DB.getDatabase().then(db =>
    db.transaction(tx => {
      tx.executeSql(`INSERT INTO Tournee VALUES (?, ?, ?, ?)`, [
        tournee.Code,
        tournee.DateDebut,
        tournee.Code_PocketPC,
        tournee.HeureFin
      ]);
    })
  );
}

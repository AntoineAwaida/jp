import sendRemote from "./sendRemote";
import { DB } from "../../../database/database";

export default function send(depot) {
  return new Promise(resolve =>
    DB.getDatabase().then(db => {
      let commandes = [];
      let commandes_composition = [];
      let tournee = [];
      db.transaction(
        tx => {
          tx.executeSql(`SELECT * FROM pct_COMMANDE`, [], (tx, results) => {
            for (let i = 0; i < results.rows.length; i++) {
              commandes.push(results.rows.item(i));
            }
          });
          tx.executeSql(
            `SELECT * FROM pct_COMMANDEcomposition`,
            [],
            (tx, results) => {
              for (let i = 0; i < results.rows.length; i++) {
                commandes_composition.push(results.rows.item(i));
              }
            }
          );
          tx.executeSql(`SELECT * FROM Tournee`, [], (tx, results) => {
            for (let i = 0; i < results.rows.length; i++) {
              tournee.push(results.rows.item(i));
            }
          });
        },
        err => {
          logError(err);
          resolve(err);
          console.log(err);
        },
        async () => {
          const result = await sendRemote(
            commandes,
            commandes_composition,
            tournee,
            depot
          );
          if (result === "ok") {
            resolve("finished");
          } else {
            resolve(result);
          }
        }
      );
    })
  );
}

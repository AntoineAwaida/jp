import { DB } from "../../../database/database";
import drop_Article from "./drop_Article";
import drop_Client from "./drop_Client";
import drop_FamilleRemise from "./drop_FamilleRemise";
import drop_TarifarticlePrix from "./drop_TarifarticlePrix";
import drop_Tournee from "./drop_Tournee";
import drop_p_Famille from "./drop_p_Famille";
import drop_p_SousFamille from "./drop_p_SousFamille";
import drop_p_Tarif from "./drop_p_Tarif";
import drop_pct_Commande from "./drop_pct_Commande";
import drop_pct_CommandeComposition from "./drop_pct_CommandeComposition";

export default function drop() {
  return new Promise(resolve =>
    DB.getDatabase().then(db => {
      db.transaction(
        tx => {
          tx.executeSql(`BEGIN TRANSACTION`);
          drop_Article(tx);
          drop_Client(tx);
          drop_FamilleRemise(tx);
          drop_TarifarticlePrix(tx);
          drop_Tournee(tx);
          drop_p_Famille(tx);
          drop_p_SousFamille(tx);
          drop_p_Tarif(tx);
          drop_pct_Commande(tx);
          drop_pct_CommandeComposition(tx);
          tx.executeSql(`COMMIT`, [], (tx, results) => {});
        },
        err => {
          logError(err);
          resolve("error");
          console.log(err);
        },
        () => {
          resolve("finished");
        }
      );
    })
  );
}

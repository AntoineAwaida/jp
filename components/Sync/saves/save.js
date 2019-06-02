import save_Client from "./save_Client";
import { DB } from "../../../database/database";
import logError from "../../Settings/logError";
import save_p_SousFamille from "./save_p_SousFamille";
import save_FamilleRemise from "./save_FamilleRemise";
import save_Article from "./save_Article";
import save_p_Tarif from "./save_p_Tarif";
import save_TarifarticlePrix from "./save_TarifarticlePrix";
export default function save(
  clients,
  p_sousFamille,
  FamilleRemise,
  TarifarticlePrix,
  Article,
  p_Tarif
) {
  return new Promise(resolve =>
    DB.getDatabase().then(db => {
      db.transaction(
        tx => {
          tx.executeSql(`BEGIN TRANSACTION`);
          save_Client(tx, clients);
          save_TarifarticlePrix(tx, TarifarticlePrix);
          save_Article(tx, Article);
          save_p_Tarif(tx, p_Tarif);
          save_p_SousFamille(tx, p_sousFamille);
          save_FamilleRemise(tx, FamilleRemise);
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

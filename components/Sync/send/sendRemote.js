import MSSQL from "react-native-mssql";
import get_Code_Commande from "../pulls/get_Code_Commande";
import logError from "../../Settings/logError";
import send_pctCOMMANDE from "./send_pctCOMMANDE";
import send_pctCOMMANDEcomposition from "./send_pctCOMMANDEcomposition";
import send_Tournee from "./send_Tournee";

export default async function sendRemote(
  commandes,
  commande_composition,
  tournee,
  depot
) {
  return new Promise(async (resolve, reject) => {
    try {
      await MSSQL.executeUpdate("BEGIN TRANSACTION");

      const commande_result = await send_pctCOMMANDE(commandes);

      if (commande_result !== "ok") {
        throw Error(commande_result);
      }

      console.log("passed commandes");

      const composition_result = await send_pctCOMMANDEcomposition(
        commande_composition
      );

      if (composition_result !== "ok") {
        throw Error(composition_result);
      }

      console.log("passed composition");

      const tournee_result = await send_Tournee(tournee);

      if (tournee_result !== "ok") {
        throw Error(tournee_result);
      }

      console.log("passed tournee");

      await MSSQL.executeUpdate("COMMIT");
      get_Code_Commande(depot);
      resolve("ok");
    } catch (e) {
      await MSSQL.executeUpdate("ROLLBACK");
      resolve(e);
    }
  });
}

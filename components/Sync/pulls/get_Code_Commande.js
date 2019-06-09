import MSSQL from "react-native-mssql";
import AsyncStorage from "@react-native-community/async-storage";

export default async function get_Code_Commande(depot) {
  let query =
    "SELECT MAX(Code_Commande) AS code FROM pct_COMMANDE WHERE nomPoste='" +
    depot +
    "'";

  const results = await MSSQL.executeQuery(query);

  await AsyncStorage.removeItem("codeCommande");

  await AsyncStorage.setItem("codeCommande", JSON.stringify(results[0].code));
}

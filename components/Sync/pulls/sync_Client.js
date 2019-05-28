import MSSQL from "react-native-mssql";
import AsyncStorage from "@react-native-community/async-storage";

export default async function sync_Client(depot) {
  let query =
    "SELECT Code_Client, RaisonSociale, adrFacturation1, adrFacturation2, adrFacturation3, Telephone1, ZoneN4, ZoneN5, Code" +
    " FROM CLIENT INNER JOIN p_Depot ON (p_depot.CP = client.Code_DepotClient) WHERE Code='" +
    depot +
    "'";

  const results = await MSSQL.executeQuery(query);

  return results;
}

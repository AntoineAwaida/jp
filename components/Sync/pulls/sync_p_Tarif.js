import MSSQL from "react-native-mssql";

export default async function sync_p_sousFamille() {
  let query = "SELECT * FROM p_Tarif";
  const results = await MSSQL.executeQuery(query);
  return results;
}

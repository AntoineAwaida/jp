import MSSQL from "react-native-mssql";

export default async function sync_p_famille() {
  let query = "SELECT * FROM p_Famille";
  const results = await MSSQL.executeQuery(query);
  return results;
}

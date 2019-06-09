import MSSQL from "react-native-mssql";

export default async function sync_zz_Util() {
  let query = "SELECT * FROM zz_Util";
  const results = await MSSQL.executeQuery(query);
  return results;
}

import MSSQL from "react-native-mssql";

export default async function sync_FamilleRemise() {
  let query = "SELECT * FROM FamilleRemise";
  const results = await MSSQL.executeQuery(query);
  return results;
}

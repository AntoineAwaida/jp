import MSSQL from "react-native-mssql";
import AsyncStorage from "@react-native-community/async-storage";

export default async function sync() {
  let config = await AsyncStorage.getItem("credentials");

  config = await JSON.parse(config);
  config.timeout = 5;
  delete config.depot;
  await MSSQL.connect(config);
  let query = "SELECT TOP 10 * FROM Tournee";
  const results = await MSSQL.executeQuery(query);
  return results;
}

import MSSQL from "react-native-mssql";

export default async function sync_TarifarticlePrix(depot) {
  let query =
    "SELECT TARIFarticlePrix.Code_Article, Code_Tarif, NumPlage, PrixUnitaire, QteMini FROM TARIFarticlePrix" +
    " INNER JOIN ARTICLEdepot ON ARTICLEdepot.Code_Article = TARIFarticlePrix.Code_Article WHERE Code_Depot='" +
    depot +
    "'";

  results = await MSSQL.executeQuery(query);

  return results;
}

import MSSQL from "react-native-mssql";
import logError from "../../Settings/logError";

export default async function sync_Article(depot) {
  let query =
    "SELECT DISTINCT TOP 1000 article.Code_Article, code_couleur, code_famille, code_four, code_gamme, code_motcle, code_qualite, code_sousfamille, code_surface, code_tva, designation, pmpa, prixrevient, StockDepot, CoefCharges" +
    " FROM article INNER JOIN ARTICLEdepot ON (ARTICLEdepot.Code_Article = Article.Code_Article) WHERE Code_Depot='" +
    depot +
    "'";

  const results = await MSSQL.executeQuery(query);

  return results;
}

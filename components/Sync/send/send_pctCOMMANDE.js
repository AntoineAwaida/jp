import logError from "../../Settings/logError";
import query_pctCOMMANDE from "./query_pctCOMMANDE";

export default async function send_pctCOMMANDE(commandes) {
  return await Promise.all(
    commandes.map(async (item, i) => {
      let columns = "";
      //formatage avec des quotes pour être en varchar sur la remote db
      item.DateCreation = "'" + item.DateCreation + "'";
      item.Code_Client = "'" + item.Code_Client + "'";
      item.nomPoste = "'" + item.nomPoste + "'";
      Object.keys(item).map(column => {
        columns += column + ",";
      });
      columns = columns.substr(0, columns.length - 1);

      let query = "";

      Object.values(item).map((i, index) => {
        if (index === Object.values(item).length - 1) {
          query += i;
        } else {
          query += i + ",";
        }
      });

      let txt = `INSERT INTO pct_COMMANDE(${columns}) VALUES(${query}); `;

      await query_pctCOMMANDE(txt);
    })
  )
    .then((res, err) => {
      return "ok";
    })
    .catch(e => {
      return e;
    });
}

import query_pctCOMMANDEcomposition from "./query_pctCOMMANDEcomposition";

export default async function send_pctCOMMANDEcomposition(
  commande_composition
) {
  return await Promise.all(
    commande_composition.map(async (item, i) => {
      let columns = "";
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

      let txt = `INSERT INTO pct_COMMANDEcomposition(${columns}) VALUES(${query})`;

      await query_pctCOMMANDEcomposition(txt);
    })
  )
    .then((res, err) => {
      return "ok";
    })
    .catch(e => {
      return e;
    });
}

import query_Tournee from "./query_Tournee";

export default async function send_Tournee(tournee) {
  return await Promise.all(
    tournee.map(async (item, i) => {
      let columns = "";
      item.DateDebut = "'" + item.DateDebut + "'";
      item.HeureFin = "'" + item.HeureFin + "'";
      item.Code_PocketPC = "'" + item.Code_PocketPC + "'";
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

      let txt = `INSERT INTO Tournee(${columns}) VALUES(${query})`;

      await query_Tournee(txt);
    })
  )
    .then((res, err) => {
      return "ok";
    })
    .catch(e => {
      return e;
    });
}

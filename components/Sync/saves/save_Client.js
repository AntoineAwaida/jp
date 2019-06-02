//changer complètement la structure - tx.executeSql dans des fichiers séparés, + un fichier global save
//pour démarrer et terminer la transaction.
export default function save_Client(tx, clients) {
  return clients.map(client => {
    //je supprime le code dépôt du client pour l'instant (pas de table p_depot => à changer ??)
    delete client.Code;

    let columns = "";
    Object.keys(client).map(column => {
      columns += column + ",";
    });
    columns = columns.substr(0, columns.length - 1);

    const query = "?,".repeat(Object.keys(client).length - 1) + "?";

    tx.executeSql(
      `INSERT INTO CLIENT(${columns}) VALUES(${query})`,
      Object.values(client)
    );
  });
}

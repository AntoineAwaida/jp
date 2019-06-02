export default function drop_Article(tx) {
  return (
    tx.executeSql(`DELETE FROM ARTICLE`) &&
    tx.executeSql(`DELETE FROM ARTICLEDepot`)
  );
}

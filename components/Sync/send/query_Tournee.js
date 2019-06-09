import MSSQL from "react-native-mssql";

export default function query_Tournee(txt) {
  return new Promise((resolve, reject) => {
    MSSQL.executeUpdate(txt)
      .then(res => {
        resolve("ok");
      })
      .catch(e => {
        reject(e);
      });
  });
}

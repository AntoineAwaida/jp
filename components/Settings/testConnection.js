import MSSQL from "react-native-mssql";

export default async function testConnection() {
  return await MSSQL.connect(config);
}

const config = {
  server: "80.12.80.85",
  username: "sa",
  password: "Cyberjet09",
  database: "dataxv",
  port: 1433,
  timeout: 5
};

import AsyncStorage from "@react-native-community/async-storage";

export default async function logCredentials(name, password, depot) {
  await AsyncStorage.removeItem("credentials");

  credentials = { name: name, password, password, depot: depot };
  console.log(credentials);

  AsyncStorage.setItem("credentials", JSON.stringify(credentials));
}

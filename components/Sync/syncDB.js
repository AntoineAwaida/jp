import MSSQL from "react-native-mssql";
import AsyncStorage from "@react-native-community/async-storage";
import sync_p_famille from "./pulls/sync_p_famille";
import sync_p_sousFamille from "./pulls/sync_p_sousFamille";

import sync_FamilleRemise from "./pulls/sync_FamilleRemise";
import sync_TarifarticlePrix from "./pulls/sync_TarifarticlePrix";
import sync_Article from "./pulls/sync_Article";

import sync_p_Tarif from "./pulls/sync_p_Tarif";

import drop_Article from "./drops/drop_Article";
import save_Article from "./saves/save_Article";

import drop_TarifarticlePrix from "./drops/drop_TarifarticlePrix";
import save_TarifarticlePrix from "./saves/save_TarifarticlePrix";

import drop_p_Tarif from "./drops/drop_p_Tarif";

import drop_p_Famille from "./drops/drop_p_Famille";

import drop_p_SousFamille from "./drops/drop_p_SousFamille";

import drop_Client from "./drops/drop_Client";

import drop_FamilleRemise from "./drops/drop_FamilleRemise";
import save_FamilleRemise from "./saves/save_FamilleRemise";
import save_p_Famille from "./saves/save_p_Famille";
import save_p_SousFamille from "./saves/save_p_SousFamille";

import save_p_Tarif from "./saves/save_p_Tarif";
import sync_Client from "./pulls/sync_Client";

import drop_pct_Commande from "./drops/drop_pct_Commande";
import drop_pct_CommandeComposition from "./drops/drop_pct_CommandeComposition";
import save_Client from "./saves/save_Client";

export default async function sync() {
  let config = await AsyncStorage.getItem("credentials");

  config = await JSON.parse(config);
  config.timeout = 5;
  const depot = config.depot;
  delete config.depot;
  await MSSQL.connect(config);

  //p_Famille désactivée, colonnes manquantes.

  await drop_Article();
  await drop_TarifarticlePrix();
  await drop_p_Tarif();
  await drop_p_SousFamille();
  //await drop_p_Famille();
  await drop_FamilleRemise();
  await drop_Client();

  await drop_pct_Commande();
  await drop_pct_CommandeComposition();

  const Client = await sync_Client(depot);
  const p_Tarif = await sync_p_Tarif();
  //const p_famille = await sync_p_famille();
  const p_sousFamille = await sync_p_sousFamille();
  const FamilleRemise = await sync_FamilleRemise();
  const TarifarticlePrix = await sync_TarifarticlePrix(depot);
  const Article = await sync_Article(depot);

  await save_p_Tarif(p_Tarif);
  await save_Article(Article);
  await save_TarifarticlePrix(TarifarticlePrix);
  await save_FamilleRemise(FamilleRemise);
  //await save_p_Famille(p_famille);
  await save_p_SousFamille(p_sousFamille);
  await save_Client(Client);

  return "ok";
}

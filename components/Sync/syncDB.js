import MSSQL from "react-native-mssql";
import AsyncStorage from "@react-native-community/async-storage";
import sync_p_sousFamille from "./pulls/sync_p_sousFamille";

import sync_FamilleRemise from "./pulls/sync_FamilleRemise";
import sync_TarifarticlePrix from "./pulls/sync_TarifarticlePrix";
import sync_Article from "./pulls/sync_Article";

import sync_p_Tarif from "./pulls/sync_p_Tarif";

import sync_Client from "./pulls/sync_Client";

import save from "./saves/save";
import drop from "./drops/drop";
import send from "./send/send";
import get_Code_Commande from "./pulls/get_Code_Commande";
import sync_zz_Util from "./pulls/sync_zz_Util";

const delay = ms => new Promise(res => setTimeout(res, ms));

export default async function sync(emitter) {
  let config = await AsyncStorage.getItem("credentials");

  config = await JSON.parse(config);
  config.timeout = 5;
  const depot = config.depot;
  delete config.depot;
  await MSSQL.connect(config);

  emitter.emit("pull");

  //p_Famille désactivée, colonnes manquantes.

  //sync (avant drop pour garantir que l'on a les donnnées avant de drop)

  const Client = await sync_Client(depot);
  const p_Tarif = await sync_p_Tarif();
  //const p_famille = await sync_p_famille();
  const p_sousFamille = await sync_p_sousFamille();
  const FamilleRemise = await sync_FamilleRemise();
  const TarifarticlePrix = await sync_TarifarticlePrix(depot);
  const Article = await sync_Article(depot);
  const zz_Util = await sync_zz_Util();

  emitter.emit("push");

  //insert into

  const _send = await send(depot);

  if (_send !== "finished") {
    throw Error(_send);
  }

  //drop

  emitter.emit("drop");

  const _drop = await drop();

  if (_drop !== "finished") {
    throw Error(_drop.message);
  }

  emitter.emit("save");

  //await save_p_Famille(p_famille);
  const result = await save(
    Client,
    p_sousFamille,
    FamilleRemise,
    TarifarticlePrix,
    Article,
    p_Tarif,
    zz_Util
  );

  if (result === "finished") {
    emitter.emit("success");
    await delay(2000);
    return "ok";
  } else {
    emitter.emit("fail");
    await delay(2000);
    throw Error(result.message);
  }
}

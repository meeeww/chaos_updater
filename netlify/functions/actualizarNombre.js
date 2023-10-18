import { schedule } from "@netlify/functions";

import axios from "axios";
import directorio from "../../variables.json";

import { Webhook } from "discord-webhook-node";
const hook = new Webhook(
  "https://discord.com/api/webhooks/1141434977733582900/XLZWqEsQti3PwOhxsFDXHKxU_owbh3L11iUcn0cHbl5yIlSjlUvBmu598HivoOOKdSi2"
);

const API = "RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206";
//https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/SupportConPanza?api_key=RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206

const handler = async function (event, context) {
  await axios.get(directorio.directorio + "cuentas").then(async function (response1) {
    if (response1.status == 200) {
      for (let cuenta in response1.data) {
        try {
          if (response1["data"][cuenta]["id_lol"] == null && response1["data"][cuenta]["puuid_lol"] == null) {
            await axios
              .get(
                "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
                  response1["data"][cuenta]["invocador"] +
                  "?api_key=" +
                  API
              )
              .then(async function (response2) {
                if (response2.status != 404) {
                //   console.log({
                //     id: response1["data"][cuenta]["id_cuenta"],
                //     id_lol: response2.data["id"],
                //     puuid_lol: response2.data["puuid"],
                //     invocador: response1["data"][cuenta]["invocador"],
                //   });
                  await axios.put(directorio.directorio + "cuenta", {
                    id: response1["data"][cuenta]["id_cuenta"],
                    id_lol: response2.data["id"],
                    puuid_lol: response2.data["puuid"],
                    invocador: response1["data"][cuenta]["invocador"],
                  });
                }
              });
          } else {
            await axios
              .get(
                "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" +
                  response1["data"][cuenta]["puuid_lol"] +
                  "?api_key=" +
                  API
              )
              .then(async function (response2) {
                if (response2.status != 404) {
                //   console.log({
                //     id: response1["data"][cuenta]["id_cuenta"],
                //     id_lol: response1["data"][cuenta]["id_lol"],
                //     puuid_lol: response1["data"][cuenta]["puuid_lol"],
                //     invocador: response2["data"]["name"],
                //   });
                  await axios.put(directorio.directorio + "cuenta", {
                    id: response1["data"][cuenta]["id_cuenta"],
                    id_lol: response1["data"][cuenta]["id_lol"],
                    puuid_lol: response1["data"][cuenta]["puuid_lol"],
                    invocador: response2["data"]["name"],
                  });
                }
              });
          }
        } catch (e) {
          console.log(e);
          hook.send("Fallo en la función actualizar nombre. <@286402429258301440>");
        }
      }
    }
  });
};

exports.handler = schedule("*/1 * * * *", handler);

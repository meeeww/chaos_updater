import { schedule } from "@netlify/functions";

import axios from "axios";
import directorio from "../../variables.json";

import { Webhook } from "discord-webhook-node";
const hook = new Webhook(
  "https://discord.com/api/webhooks/1141434977733582900/XLZWqEsQti3PwOhxsFDXHKxU_owbh3L11iUcn0cHbl5yIlSjlUvBmu598HivoOOKdSi2"
);

const API = "RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206";
//https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/SupportConPanza?api_key=RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206

///cuentas/id=
const handler = async function (event, context) {
  await axios.get(directorio.directorio + "usuarios").then(async function (response1) {
    if (response1.status == 200) {
      for (let usuario in response1.data) {
        try {
          await axios
            .get(directorio.directorio + "usuarios/cuentas/id=" + usuario["id_usuario"])
            .then(async function (response2) {
              if (response2.data.length > 0) {
                console.log(response2.data.length)
                console.log(response2.data);
                await axios
                  .get(
                    "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
                      response2.data[0]["invocador"] +
                      "?api_key=" +
                      API
                  )
                  .then(async function (response3) {
                    if (response3.status != 404) {
                      await axios.put(directorio.directorio + "usuario/icono", {
                        id: usuario["id_usuario"],
                        icono: response3.data["profileIconId"],
                      });
                    }
                  });
              }
            });
        } catch (e) {
          console.log(e);
          hook.send("Fallo en la función actualizar foto perfil. <@286402429258301440>");
        }
      }
    }
  });
};

exports.handler = schedule("*/1 * * * *", handler);

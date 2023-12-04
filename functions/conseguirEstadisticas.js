import axios from "axios";
import directorio from "../variables.json" assert { type: "json" };

//http://localhost:3000/partidos/inhouses/estadisticas

import { Webhook } from "discord-webhook-node";
const hook = new Webhook("https://discord.com/api/webhooks/1141434977733582900/XLZWqEsQti3PwOhxsFDXHKxU_owbh3L11iUcn0cHbl5yIlSjlUvBmu598HivoOOKdSi2");

const API = "RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206";
//https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/SupportConPanza?api_key=RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206

export default async function conseguirEstadisticas() {
  await axios
    .get(directorio.directorio + "partidos/inhouses/estadisticas")
    .then(async function (response1) {
      if (response1.status == 200) {
        response1.data.result.forEach((idPartido) => {
          console.log(idPartido);
          axios.get("https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_"+idPartido["match_id"]+"?api_key=" + API).then(async function(response2){
            console.log(response2.data)
          })
        });
      } else {
        hook.send("Fallo en la función conseguir estadisticas.");
      }

      // if (response1.status == 200) {
      //   for (let cuenta in response1.data.result) {
      //     try {
      //       if (response1["data"]["result"][cuenta]["puuid_lol"] == null) {
      //         await axios
      //           .get(
      //             "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/" +
      //               response1["data"]["result"][cuenta]["invocador"] +
      //               "/" +
      //               response1["data"]["result"][cuenta]["tag"] +
      //               "?api_key=" +
      //               API
      //           )
      //           .then(async function (response2) {
      //             if (response2.status != 404) {
      //               await axios.put(
      //                 directorio.directorio + "cuentas",
      //                 {
      //                   id: response1["data"]["result"][cuenta]["id_cuenta"],
      //                   puuid_lol: response2.data["puuid"],
      //                   invocador: response1["data"]["result"][cuenta]["invocador"],
      //                   tag: response1["data"]["result"][cuenta]["tag"],
      //                 },
      //                 {
      //                   headers: {
      //                     "x-auth-token":
      //                       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
      //                   },
      //                 }
      //               );
      //             }
      //           });
      //       } else {
      //         await axios
      //           .get(
      //             "https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/" + response1["data"]["result"][cuenta]["puuid_lol"] + "?api_key=" + API
      //           )
      //           .then(async function (response2) {
      //             if (response2.status != 404) {
      //               await axios.put(
      //                 directorio.directorio + "cuentas",
      //                 {
      //                   id: response1["data"]["result"][cuenta]["id_cuenta"],
      //                   puuid_lol: response1["data"]["result"][cuenta]["puuid_lol"],
      //                   invocador: response2["data"]["gameName"],
      //                   tag: response2["data"]["tagLine"],
      //                 },
      //                 {
      //                   headers: {
      //                     "x-auth-token":
      //                       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
      //                   },
      //                 }
      //               );
      //             }
      //           });
      //       }
      //     } catch (e) {
      //       console.log(e);
      //       hook.send("Fallo en la función actualizar nombre." + response1.data.result[cuenta]["invocador"] + "#" + response1.data.result[cuenta]["tag"]);
      //     }
      //   }
      // }
    })
    .catch(async function (error) {
      console.log(error);
    });
}

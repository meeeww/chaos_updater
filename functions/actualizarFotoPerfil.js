import axios from "axios";
import directorio from "../variables.json" assert { type: "json" };

import { Webhook } from "discord-webhook-node";
const hook = new Webhook("https://discord.com/api/webhooks/1141434977733582900/XLZWqEsQti3PwOhxsFDXHKxU_owbh3L11iUcn0cHbl5yIlSjlUvBmu598HivoOOKdSi2");

const API = "RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206";
//https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/SupportConPanza?api_key=RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206

export default async function actualizarFotoPerfil() {
  await axios
    .get(directorio.directorio + "usuarios", {
      headers: {
        "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
      },
    })
    .then(async function (response1) {
      if (response1.status == 200) {
        //console.log(response1.data.result)

        response1.data.result.forEach(async user => {
          //console.log(user)
          try {
            if (user.icono == 0) {
              //console.log("Cambiando icono del usuario "+ user.nick_usuario)
              await axios
                .get(directorio.directorio + "usuarios/cuentas/id=" + user.id_usuario, {
                  headers: {
                    "x-auth-token":
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
                  },
                })
                .then(async function (response2) {
                  if (response2.data.result.length > 0) {
                    let usuarioweb = response2.data.result[0]
                    //console.log(usuarioweb)
                    console.log("puuid de "+ user.nick_usuario + " es " + usuarioweb.puuid_lol)
                    console.log(usuarioweb)
                    await axios
                      .get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" + usuarioweb.puuid_lol + "?api_key=" + API)
                      .then(async function (response3) {
                        if (response3.status == 200) {
                          console.log("Cambiando icono del usuario "+ user.nick_usuario + " con id " + user.id_usuario + " al icono numero " + response3.data.profileIconId.toString())
                          await axios.put(
                            
                            directorio.directorio + "usuarios/icono",
                            {
                              id: user.id_usuario,
                              icono: response3.data.profileIconId.toString(),
                            },
                            {
                              headers: {
                                "x-auth-token":
                                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
                              },
                            }
                          );
                        } else {
                          hook.send("Fallo en la función actualizar foto perfil. <@286402429258301440> Error:" + response1.status);
                        }
                      });
                  }
                  
                });
            }
          } catch (e) {
            //console.log("error")
            console.log("Error para el usuario "+ user.nick_usuario)
            console.log(user)
            //console.log(e.response);
            
            //if (e.response.status != 404) hook.send("Fallo en la función actualizar foto perfil. <@286402429258301440>");
          }
        });

        // for (let usuario in response1.data.result) {
        //   //console.log(usuario)
        //   try {
        //     if (response1["data"]["result"][usuario]["icono"] == 0) {
        //       await axios
        //         .get(directorio.directorio + "usuarios/cuentas/id=" + response1["data"]["result"][usuario]["id_usuario"], {
        //           headers: {
        //             "x-auth-token":
        //               "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
        //           },
        //         })
        //         .then(async function (response2) {
        //           if (response2.data.result.length > 0) {
        //             await axios
        //               .get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" + response2.data.result[0]["puuid_lol"] + "?api_key=" + API)
        //               .then(async function (response3) {
        //                 if (response3.status == 200) {
        //                   await axios.put(
        //                     directorio.directorio + "usuarios/icono",
        //                     {
        //                       id: response1["data"]["result"][usuario]["id_usuario"],
        //                       icono: response3.data["profileIconId"].toString(),
        //                     },
        //                     {
        //                       headers: {
        //                         "x-auth-token":
        //                           "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
        //                       },
        //                     }
        //                   );
        //                 } else {
        //                   hook.send("Fallo en la función actualizar foto perfil. <@286402429258301440> Error:" + response1.status);
        //                 }
        //               });
        //           }
        //         });
        //     }
        //   } catch (e) {
        //     //console.log(e);
        //     console.log("error")
        //     if (e.response.status != 404) hook.send("Fallo en la función actualizar foto perfil. <@286402429258301440>");
        //   }
        // }
      }
    })
    .catch(async function (error) {
    console.log(error);
    });
};
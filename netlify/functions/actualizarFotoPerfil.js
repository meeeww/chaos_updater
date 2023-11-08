import { schedule } from "@netlify/functions";

import axios from "axios";
import directorio from "../../variables.json";

import { Webhook } from "discord-webhook-node";
const hook = new Webhook("https://discord.com/api/webhooks/1141434977733582900/XLZWqEsQti3PwOhxsFDXHKxU_owbh3L11iUcn0cHbl5yIlSjlUvBmu598HivoOOKdSi2");

const API = "RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206";
//https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/SupportConPanza?api_key=RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206

const handler = async function (event, context) {
    await axios
        .get(directorio.directorio + "usuarios", {
            headers: {
                "x-auth-token":
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
            },
        })
        .then(async function (response1) {
            if (response1.status == 200) {
                for (let usuario in response1.data.result) {
                    try {
                        await axios
                            .get(directorio.directorio + "usuarios/cuentas/id=" + response1["data"]["result"][usuario]["id_usuario"], {
                                headers: {
                                    "x-auth-token":
                                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
                                },
                            })
                            .then(async function (response2) {
                                if (response2.data.result.length > 0) {
                                    await axios
                                        .get(
                                            "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" +
                                                response2.data.result[0]["puuid_lol"] +
                                                "?api_key=" +
                                                API
                                        )
                                        .then(async function (response3) {
                                            if (response3.status != 404) {
                                                await axios.put(
                                                    directorio.directorio + "usuarios/icono",
                                                    {
                                                        id: response1["data"]["result"][usuario]["id_usuario"],
                                                        icono: response3.data["profileIconId"].toString(),
                                                    },
                                                    {
                                                        headers: {
                                                            "x-auth-token":
                                                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
                                                        },
                                                    }
                                                );
                                            }
                                        });
                                }
                            });
                    } catch (e) {
                        console.log(e);
                        hook.send("Fallo en la función actualizar foto perfil. <@286402429258301440>");
                    }
                }
            } else {
                hook.send("Fallo en la función actualizar foto perfil. <@286402429258301440> Error:" + response1.status);
            }
        })
        .catch(async function (error) {
            console.log(error);
        });
};

exports.handler = schedule("*/11 * * * *", handler);

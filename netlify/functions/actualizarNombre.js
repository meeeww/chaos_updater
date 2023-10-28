import { schedule } from "@netlify/functions";

import axios from "axios";
import directorio from "../../variables.json";

import { Webhook } from "discord-webhook-node";
const hook = new Webhook("https://discord.com/api/webhooks/1141434977733582900/XLZWqEsQti3PwOhxsFDXHKxU_owbh3L11iUcn0cHbl5yIlSjlUvBmu598HivoOOKdSi2");

const API = "RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206";
//https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/SupportConPanza?api_key=RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206

const handler = async function (event, context) {
    await axios
        .get(directorio.directorio + "cuentas", {
            headers: {
                "x-auth-token":
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
            },
        })
        .then(async function (response1) {
            if (response1.status == 200) {
                for (let cuenta in response1.data.result) {
                    try {
                        if (response1["data"]["result"][cuenta]["puuid_lol"] == null) {
                            await axios
                                .get(
                                    "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/" +
                                        response1["data"]["result"]["invocador"] +
                                        "/" +
                                        response1["data"]["result"]["tag"] +
                                        "?api_key=" +
                                        API
                                )
                                .then(async function (response2) {
                                    if (response2.status != 404) {
                                        await axios.put(
                                            directorio.directorio + "cuentas",
                                            {
                                                id: response1["data"]["result"]["id_cuenta"],
                                                puuid_lol: response2.data["puuid"],
                                                invocador: response1["data"]["result"]["invocador"],
                                                tag: response1["data"]["result"]["tag"],
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
                        } else {
                            await axios
                                .get(
                                    "https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/" +
                                        response1["data"]["result"][cuenta]["puuid_lol"] +
                                        "?api_key=" +
                                        API
                                )
                                .then(async function (response2) {
                                    console.log(response2);
                                    if (response2.status != 404) {
                                        await axios
                                            .put(
                                                directorio.directorio + "cuentas",
                                                {
                                                    id: response1["data"]["result"]["id_cuenta"],
                                                    puuid_lol: response1["data"]["result"]["puuid_lol"],
                                                    invocador: response2["data"]["gameName"],
                                                    tag: response2["data"]["tagLine"],
                                                },
                                                {
                                                    headers: {
                                                        "x-auth-token":
                                                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsInJvbCI6MjAsImlhdCI6MTY5ODE3OTA4N30.B0jQsHr758WzdB7Vv50q-kMHQoNlHVQvwq5E6Wpuvf4",
                                                    },
                                                }
                                            )
                                            .then(async function (respuesta) {
                                                console.log(respuesta);
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
        })
        .catch(async function (error) {
            console.log(error);
        });
};

exports.handler = schedule("*/2 * * * *", handler);

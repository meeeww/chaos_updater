import { schedule } from "@netlify/functions";
import axios from 'axios'

import { Webhook } from 'discord-webhook-node';
const hook = new Webhook("https://discord.com/api/webhooks/1141434977733582900/XLZWqEsQti3PwOhxsFDXHKxU_owbh3L11iUcn0cHbl5yIlSjlUvBmu598HivoOOKdSi2");

const API = "RGAPI-48c2e07c-b903-4720-be64-d3ba9a416206"


const handler = async function (event, context) {
    await axios.get("https://api.chaoschampionship.com/.netlify/functions/api/usuarios").then(async function (response1) {
        if (response1.status == 200) {
            for (let cuenta in response1.data) {
                try {
                    if (response1.data[cuenta]["id_ingame"] == null) {
                        console.log("hey3")
                        await axios.get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + response1.data[cuenta]["nombre_ingame"] + "?api_key=" + API).then(async function (response2) {
                            console.log({ idCuenta: response1.data[cuenta]["id_cuenta"], idRiot: response2.data["id"], puuidRiot: response2.data["puuid"] })
                            await axios.put("https://api.chaoschampionship.com/.netlify/functions/api/usuarios/modificar/lol/ids", { idCuenta: response1.data[cuenta]["id_cuenta"], idRiot: response2.data["id"], puuidRiot: response2.data["puuid"] }, { timeout: 10000, headers: { 'Content-Type': 'application/json' } })
                        })
                    } else {
                        await axios.get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" + response1.data[cuenta]["puuid_ingame"] + "?api_key=" + API).then(async function (response2) {
                            if (response1.data[cuenta]["nombre_ingame"] != response2.data["name"]) {
                                await axios.put("https://api.chaoschampionship.com/.netlify/functions/api/usuarios/modificar/lol/nombre", { nombreRiot: response2.data["name"], idUsuario: response1.data[cuenta]["id_usuario"] }, { timeout: 10000, headers: { 'Content-Type': 'application/json' } })
                            }
                        })
                    }
                } catch {
                    hook.send("Fallo en la función. <@286402429258301440>")
                }
            }
        }
    })
};

exports.handler = schedule("*/1 * * * *", handler);
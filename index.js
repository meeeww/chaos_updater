import cron from "node-cron";

import actualizarFotoPerfil from "./functions/actualizarFotoPerfil.js";
import actualizarFotoPerfilForzado from "./functions/actualizarFotoPerfilForzado.js";
import actualizarNombre from "./functions/actualizarNombre.js";

cron.schedule("*/5 * * * *", () => {
  actualizarFotoPerfil();
});

cron.schedule("0 7 * * *", () => {
  actualizarFotoPerfilForzado();
});

cron.schedule("*/3 * * * *", () => {
  actualizarNombre();
});

//hay que hacer las funciones:
// recoger estadisticas de jugadores
// quitar el @ de los links de la gente

// arreglar errores en actualizar foto de perfil y actualizar nombre
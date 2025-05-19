const db = require('./db');

async function main() {
  await db.conectar();
  console.log("Sistema iniciado. Use arquivos de teste individuais.");
  await db.desconectar();
}

main();

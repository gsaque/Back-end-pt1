const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs.txt');

function registrarLog(tipo, mensagem) {
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}] [${tipo.toUpperCase()}] ${mensagem}\n`;
  fs.appendFileSync(logFilePath, log, 'utf8');
}

module.exports = { registrarLog };

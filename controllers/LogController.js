const fs = require('fs').promises;
const path = require('path');

const logFilePath = path.join(__dirname, '../logs.txt');

async function registrarLogAsync(level, mensagem) {
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}] [${level.toUpperCase()}] ${mensagem}\n`;
  await fs.appendFile(logFilePath, log, 'utf8');
}

module.exports = {
  async inserirLog(action, message, level = 'info') {
    await registrarLogAsync(level, `${action}: ${message}`);
  },

  async listar() {
    const data = await fs.readFile(logFilePath, 'utf8');
    return data.split('\n')
      .filter(line => line)
      .map((line, index) => ({
        id: index + 1,
        linha: line
      }));
  }
};

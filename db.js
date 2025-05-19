// db.js
const mongoose = require('mongoose');

async function conectar() {
  try {
    await mongoose.connect('mongodb://localhost:27017/projeto1');
    console.log('Conectado ao MongoDB!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    throw err; // Lançamos o erro para garantir que o fluxo seja interrompido em caso de falha.
  }
}

async function desconectar() {
  try {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB.');
  } catch (err) {
    console.error('Erro ao desconectar do MongoDB:', err);
  }
}

module.exports = { conectar, desconectar };

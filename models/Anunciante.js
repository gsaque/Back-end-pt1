const mongoose = require('mongoose');

const anuncianteSchema = new mongoose.Schema({
  nome: { type: String, required: true }, // nome da empresa
  email: {
    type: String,
    required: true,
    match: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/
  },
  sitesPatrocinados: [{ type: String }]
});

module.exports = mongoose.model('Anunciante', anuncianteSchema);

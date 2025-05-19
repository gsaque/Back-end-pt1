const Anunciante = require('../models/Anunciante');
const logController = require('./LogController');

module.exports = {
  async insert(data) {
    try {
      if (!data.nome || !data.email) {
        throw new Error('Os campos "nome" e "email" são obrigatórios.');
      }

      const anunciante = new Anunciante(data);
      await anunciante.save();

      await logController.inserirLog('info', `Anunciante ${data.nome} inserido com sucesso.`);
    } catch (error) {
      await logController.inserirLog('error', `Erro ao inserir anunciante: ${error.message}`);
      throw error;
    }
  },

  async listar() {
    try {
      return await Anunciante.find();
    } catch (error) {
      await logController.inserirLog('error', `Erro ao listar anunciantes: ${error.message}`);
      throw error;
    }
  },

  async excluirPorNome(nome) {
    try {
      const result = await Anunciante.findOneAndDelete({ nome });
      if (result) {
        await logController.inserirLog('info', `Anunciante ${nome} excluído com sucesso.`);
      } else {
        await logController.inserirLog('warn', `Anunciante ${nome} não encontrado para exclusão.`);
      }
      return result;
    } catch (error) {
      await logController.inserirLog('error', `Erro ao excluir anunciante: ${error.message}`);
      throw error;
    }
  }
};
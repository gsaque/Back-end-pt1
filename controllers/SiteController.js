const Site = require('../models/Site');
const logController = require('./LogController'); 
module.exports = {
  async insert(data) {
    try {
      if (!data.url || !data.title || !data.description || !data.keywords) {
        throw new Error('Todos os campos do site são obrigatórios.');
      }
      const site = new Site(data);
      await site.save();

      await logController.inserirLog('info', `Site ${data.title} inserido.`);
    } catch (error) {
      await logController.inserirLog('error', `Erro ao inserir site: ${error.message}`);
      throw error;
    }
  },

  async listar() {
    try {
      return await Site.find();
    } catch (error) {
      await logController.inserirLog('error', `Erro ao listar sites: ${error.message}`);
      throw error;
    }
  },

  async buscarPorPalavraChave(palavra) {
    try {
      return await Site.find({ keywords: { $regex: new RegExp(palavra, 'i') } });
    } catch (error) {
      await logController.inserirLog('error', `Erro ao buscar site por palavra-chave: ${error.message}`);
      throw error;
    }
  },

  async buscarPorTitulo(titulo) {
    try {
      return await Site.find({ title: { $regex: new RegExp(titulo, 'i') } });
    } catch (error) {
      await logController.inserirLog('error', `Erro ao buscar site por título: ${error.message}`);
      throw error;
    }
  },

  async excluirPorTitulo(titulo) {
    try {
      const result = await Site.findOneAndDelete({ title: titulo });
      if (result) {
        await logController.inserirLog('info', `Site ${titulo} excluído.`);
      } else {
        await logController.inserirLog('warn', `Site ${titulo} não encontrado para exclusão.`);
      }
      return result;
    } catch (error) {
      await logController.inserirLog('error', `Erro ao excluir site: ${error.message}`);
      throw error;
    }
  }
};

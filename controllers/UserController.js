const User = require('../models/User');
const logController = require('./LogController');

module.exports = {
  async insert(data) {
    try {
      if (!data.username || !data.email || !data.password) {
        throw new Error('Todos os campos de usuário são obrigatórios.');
      }
      const user = new User(data);
      await user.save();

      await logController.inserirLog('info', `Usuário ${data.username} inserido.`);
    } catch (error) {
      await logController.inserirLog('error', `Erro ao inserir usuário: ${error.message}`);
      throw error;
    }
  },

  async listar() {
    try {
      return await User.find();
    } catch (error) {
      await logController.inserirLog('error', `Erro ao listar usuários: ${error.message}`);
      throw error;
    }
  },

  async excluirPorUsername(username) {
    try {
      const result = await User.findOneAndDelete({ username });
      if (result) {
        await logController.inserirLog('info', `Usuário ${username} excluído.`);
      } else {
        await logController.inserirLog('warn', `Usuário ${username} não encontrado para exclusão.`);
      }
      return result;
    } catch (error) {
      await logController.inserirLog('error', `Erro ao excluir usuário: ${error.message}`);
      throw error;
    }
  }
};

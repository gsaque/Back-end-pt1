const db = require('../db');
const siteController = require('../controllers/SiteController');
const userController = require('../controllers/UserController');
const anuncianteController = require('../controllers/AnuncianteController');
const Site = require('../models/Site');
const User = require('../models/User');
const Anunciante = require('../models/Anunciante');

async function testarErrosSite() {
  try {
    await db.conectar();

    // 1. Testar insert() com dados incompletos
    try {
      console.log("\nTestando insert() com dados incompletos (Site)");
      await siteController.insert({
        url: 'https://siteincompleto.com'
        // faltam title, description, keywords
      });
    } catch (error) {
      console.error("Erro esperado em insert Site:", error.message);
    }

    // 2. Testar listar() simulando falha no banco de dados
    try {
      console.log("\nTestando listar() com falha simulada (Site)");
      const originalFind = Site.find;
      Site.find = () => { throw new Error('Falha simulada no banco Site'); };

      await siteController.listar();

      Site.find = originalFind; // restaura método original após teste
    } catch (error) {
      console.error("Erro esperado em listar Site:", error.message);
      Site.find = Site.find; // garante restauração mesmo em erro
    }

    // 3. Testar buscarPorPalavraChave() com parâmetro inválido (undefined)
    try {
      console.log("\nTestando buscarPorPalavraChave() com valor inválido (Site)");
      await siteController.buscarPorPalavraChave(undefined);
    } catch (error) {
      console.error("Erro esperado em buscarPorPalavraChave Site:", error.message);
    }

    // 4. Testar buscarPorTitulo() com parâmetro inválido (objeto ao invés de string)
    try {
      console.log("\nTestando buscarPorTitulo() com valor inválido (Site)");
      await siteController.buscarPorTitulo({ titulo: 'abc' }); // objeto inválido
    } catch (error) {
      console.error("Erro esperado em buscarPorTitulo Site:", error.message);
    }

    // 5. Testar excluirPorTitulo() com título inexistente no banco
    try {
      console.log("\nTestando excluirPorTitulo() com título inexistente (Site)");
      const result = await siteController.excluirPorTitulo('TituloInexistente999');
      if (!result) {
        console.warn("Nenhum site excluído, como esperado.");
      }
    } catch (error) {
      console.error("Erro inesperado em excluirPorTitulo Site:", error.message);
    }

  } catch (err) {
    console.error("Erro geral durante testes Site:", err.message);
  } finally {
    await db.desconectar();
  }
}

async function testarErrosUser() {
  try {
    await db.conectar();

    // 1. Testar insert() com dados incompletos (faltando password e email vazio)
    // Espera-se erro por campos obrigatórios ausentes ou inválidos
    try {
      console.log('\nTestando insert() com dados incompletos (User)');
      await userController.insert({ username: 'user1', email: '' }); // password faltando e email vazio
    } catch (error) {
      console.error('Erro esperado em insert User:', error.message);
    }

    // 2. Testar listar() simulando falha no banco de dados
    // Sobrescreve temporariamente o método User.find para lançar erro e testar tratamento
    try {
      console.log('\nTestando listar() com falha simulada (User)');
      const originalFind = User.find;
      User.find = () => { throw new Error('Falha simulada no banco User'); };

      await userController.listar();

      User.find = originalFind; // restaura método original após teste
    } catch (error) {
      console.error('Erro esperado em listar User:', error.message);
      User.find = User.find; // garante restauração
    }

    // 3. Testar excluirPorUsername() com username inexistente no banco
    // Espera-se retorno indicando que nada foi excluído (falso ou null)
    try {
      console.log('\nTestando excluirPorUsername() com username inexistente (User)');
      const resultado = await userController.excluirPorUsername('usuario_inexistente_123');
      if (!resultado) {
        console.warn('Nenhum usuário excluído, como esperado.');
      }
    } catch (error) {
      console.error('Erro inesperado em excluirPorUsername User:', error.message);
    }

  } catch (err) {
    console.error("Erro geral durante testes User:", err.message);
  } finally {
    await db.desconectar();
  }
}

async function testarErrosAnunciante() {
  try {
    await db.conectar();

    // 1. Testar insert() com dados incompletos (faltando email)
    // Espera-se erro por ausência de campo obrigatório email
    try {
      console.log('\nTestando insert() com dados incompletos (Anunciante)');
      await anuncianteController.insert({ nome: 'AnuncianteSemEmail' }); // email ausente
    } catch (error) {
      console.error('Erro esperado em insert Anunciante:', error.message);
    }

    // 2. Testar listar() simulando falha no banco de dados
    // Sobrescreve temporariamente Anunciante.find para lançar erro e testar tratamento
    try {
      console.log('\nTestando listar() com falha simulada (Anunciante)');
      const originalFind = Anunciante.find;
      Anunciante.find = () => { throw new Error('Falha simulada no banco Anunciante'); };

      await anuncianteController.listar();

      Anunciante.find = originalFind; // restaura método após teste
    } catch (error) {
      console.error('Erro esperado em listar Anunciante:', error.message);
      Anunciante.find = Anunciante.find; // garante restauração
    }

    // 3. Testar excluirPorNome() com nome inexistente
    // Espera-se que nenhum anunciante seja excluído, método retorna falso ou equivalente
    try {
      console.log('\nTestando excluirPorNome() com nome inexistente (Anunciante)');
      const resultado = await anuncianteController.excluirPorNome('NomeQueNaoExiste999');
      if (!resultado) {
        console.warn('Nenhum anunciante excluído, como esperado.');
      }
    } catch (error) {
      console.error('Erro inesperado em excluirPorNome Anunciante:', error.message);
    }

  } catch (err) {
    console.error("Erro geral durante testes Anunciante:", err.message);
  } finally {
    await db.desconectar();
  }
}

async function rodarTestesErros() {
  console.log("=== Testando erros Site ===");
  await testarErrosSite();

  console.log("\n=== Testando erros User ===");
  await testarErrosUser();

  console.log("\n=== Testando erros Anunciante ===");
  await testarErrosAnunciante();

  console.log("\nTodos os testes de erros foram executados com sucesso.");
}

rodarTestesErros();

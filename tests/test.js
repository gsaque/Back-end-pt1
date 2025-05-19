const db = require('../db');
const logController = require('../controllers/LogController');
const siteController = require('../controllers/SiteController');
const userController = require('../controllers/UserController');
const anuncianteController = require('../controllers/AnuncianteController');


// Testa o CRUD básico para sites usando o SiteController
async function testarSites() {
  try {
    await db.conectar();

    // Inserir um novo site com todos os dados necessários
    const novoSite = {
      url: 'https://exemplo.com',
      title: 'Site Exemplo',
      description: 'Um site de exemplo para testes',
      keywords: ['teste', 'exemplo', 'controller']
    };

    console.log('\nInserindo site...');
    await siteController.insert(novoSite);

    // Listar todos os sites cadastrados e mostrar dados selecionados
    console.log('\nListando todos os sites:');
    const todosOsSites = await siteController.listar();
    console.table(todosOsSites.map(s => ({
      title: s.title,
      url: s.url,
      description: s.description,
      keywords: s.keywords
    })));

    // Buscar sites que contenham "Exemplo" no título
    console.log('\nBuscando site por título "Exemplo":');
    const buscaTitulo = await siteController.buscarPorTitulo('Exemplo');
    console.table(buscaTitulo.map(s => ({
      title: s.title,
      url: s.url
    })));

    // Buscar sites que contenham a palavra-chave "controller"
    console.log('\nBuscando site por palavra-chave "controller":');
    const buscaKeyword = await siteController.buscarPorPalavraChave('controller');
    console.table(buscaKeyword.map(s => ({
      title: s.title,
      keywords: s.keywords
    })));

    // Excluir o site pelo título "Site Exemplo"
    console.log('\nExcluindo site pelo título...');
    const exclusao = await siteController.excluirPorTitulo('Site Exemplo');
    console.log(exclusao ? 'Site excluído com sucesso.' : 'Site não encontrado para exclusão.');

    // Confirmar exclusão tentando buscar o site novamente
    console.log('\nConfirmando que o site foi excluído:');
    const confirmacao = await siteController.buscarPorTitulo('Site Exemplo');
    console.log(confirmacao.length === 0 ? 'Nenhum site encontrado.' : 'Ainda existem sites com esse título.');
  } catch (error) {
    console.error('Erro ao testar sites:', error.message);
  } finally {
    await db.desconectar();
  }
}

// Testa funcionalidades básicas do UserController: inserção, listagem e exclusão de usuários
async function testarUsuarios() {
  await db.conectar();

  // Inserir um usuário com dados básicos
  await userController.insert({
    username: 'testeuser',
    email: 'teste@example.com',
    password: '123456'
  });
  console.log("Usuário inserido.");

  // Listar todos os usuários e mostrar username e email
  const users = await userController.listar();
  console.table(users.map(u => ({ username: u.username, email: u.email })));

  // Excluir o usuário criado pelo username
  await userController.excluirPorUsername('testeuser');
  console.log("Usuário excluído.");

  await db.desconectar();
}

// Testa o CRUD básico para anunciantes usando o AnuncianteController
async function testarAnunciantes() {
  try {
    await db.conectar();

    // Inserir um novo anunciante com nome, email e sites patrocinados
    const novoAnunciante = {
      nome: 'Empresa XYZ',
      email: 'contato@xyz.com',
      sitesPatrocinados: ['https://xyz.com', 'https://xyz-parceiro.com']
    };

    console.log('\nInserindo anunciante...');
    await anuncianteController.insert(novoAnunciante);

    // Listar anunciantes e mostrar informações principais
    console.log('\nListando anunciantes:');
    const anunciantes = await anuncianteController.listar();
    console.table(anunciantes.map(a => ({
      nome: a.nome,
      email: a.email,
      sitesPatrocinados: a.sitesPatrocinados.join(', ')
    })));

    // Excluir o anunciante pelo nome
    console.log('\nExcluindo anunciante por nome...');
    const excluido = await anuncianteController.excluirPorNome('Empresa XYZ');
    console.log(excluido ? 'Anunciante excluído com sucesso.' : 'Anunciante não encontrado para exclusão.');

    // Confirmar exclusão verificando se o anunciante ainda existe
    console.log('\nConfirmando que o anunciante foi excluído:');
    const confirmacao = await anuncianteController.listar();
    const aindaExiste = confirmacao.find(a => a.nome === 'Empresa XYZ');
    console.log(aindaExiste ? 'Anunciante ainda existe.' : 'Anunciante removido com sucesso.');
  } catch (error) {
    console.error('Erro ao testar anunciantes:', error.message);
  } finally {
    await db.desconectar();
  }
}

// Função principal que chama todos os testes de forma sequencial
async function rodarTestes() {
  try {
    console.log("\n=== Testando Sites ===");
    await testarSites();

    console.log("\n=== Testando Usuários ===");
    await testarUsuarios();

    console.log("\n=== Testando Anunciantes ===");
    await testarAnunciantes();

    console.log("\nTodos os testes foram executados com sucesso.");
  } catch (error) {
    console.error("Erro durante os testes:", error.message);
  }
}

rodarTestes();

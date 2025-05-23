const db = require('../db');
const bcrypt = require('bcrypt');
const siteController = require('../controllers/SiteController');
const userController = require('../controllers/UserController');
const anuncianteController = require('../controllers/AnuncianteController');

async function testarSites() {
  try {
    const novoSite = {
      url: 'https://exemplo.com',
      title: 'Site Exemplo',
      description: 'Um site de exemplo para testes',
      keywords: ['teste', 'exemplo', 'controller']
    };

    console.log('\nInserindo site...');
    await siteController.insert(novoSite);

    console.log('\nListando todos os sites:');
    const todosOsSites = await siteController.listar();
    console.table(todosOsSites.map(s => ({
      title: s.title,
      url: s.url,
      description: s.description,
      keywords: s.keywords
    })));

    console.log('\nBuscando site por título "Exemplo":');
    const buscaTitulo = await siteController.buscarPorTitulo('Exemplo');
    console.table(buscaTitulo.map(s => ({
      title: s.title,
      url: s.url
    })));

    console.log('\nBuscando site por palavra-chave "controller":');
    const buscaKeyword = await siteController.buscarPorPalavraChave('controller');
    console.table(buscaKeyword.map(s => ({
      title: s.title,
      keywords: s.keywords
    })));

    console.log('\nExcluindo site pelo título...');
    const exclusao = await siteController.excluirPorTitulo('Site Exemplo');
    console.log(exclusao ? 'Site excluído com sucesso.' : 'Site não encontrado para exclusão.');

    console.log('\nConfirmando que o site foi excluído:');
    const confirmacao = await siteController.buscarPorTitulo('Site Exemplo');
    console.log(confirmacao.length === 0 ? 'Nenhum site encontrado.' : 'Ainda existem sites com esse título.');
  } catch (error) {
    console.error('Erro ao testar sites:', error.message);
  }
}

async function testarUsuarios() {
  try {
    const dados = {
      username: 'testeuser',
      email: 'teste@example.com',
      password: '123456'
    };

    await userController.excluirPorUsername(dados.username);

    console.log('\nInserindo usuário...');
    await userController.insert(dados);
    console.log('Usuário inserido.');

    const users = await userController.listar();
    const usuario = users.find(u => u.username === dados.username);

    if (usuario) {
      console.log('\nUsuário encontrado:');
      console.log('Username:', usuario.username);
      console.log('Email:', usuario.email);
      console.log('Senha criptografada:', usuario.password);

      const senhaCorreta = '123456';
      const senhaIncorreta = 'errada123';

      const isMatchCorreta = await bcrypt.compare(senhaCorreta, usuario.password);
      const isMatchIncorreta = await bcrypt.compare(senhaIncorreta, usuario.password);

      console.log('\nVerificando senha correta (123456):', isMatchCorreta ? 'Senha correta' : 'Senha incorreta');
      console.log('Verificando senha incorreta (errada123):', isMatchIncorreta ? 'Senha correta' : 'Senha incorreta');
    } else {
      console.log('Usuário não encontrado após inserção.');
    }

    await userController.excluirPorUsername(dados.username);
    console.log('Usuário excluído.');
  } catch (error) {
    console.error('Erro ao testar usuários:', error.message);
  }
}

async function testarAnunciantes() {
  try {
    const novoAnunciante = {
      nome: 'Empresa XYZ',
      email: 'contato@xyz.com',
      sitesPatrocinados: ['https://xyz.com', 'https://xyz-parceiro.com']
    };

    console.log('\nInserindo anunciante...');
    await anuncianteController.insert(novoAnunciante);

    console.log('\nListando anunciantes:');
    const anunciantes = await anuncianteController.listar();
    console.table(anunciantes.map(a => ({
      nome: a.nome,
      email: a.email,
      sitesPatrocinados: a.sitesPatrocinados.join(', ')
    })));

    console.log('\nExcluindo anunciante por nome...');
    const excluido = await anuncianteController.excluirPorNome(novoAnunciante.nome);
    console.log(excluido ? 'Anunciante excluído com sucesso.' : 'Anunciante não encontrado para exclusão.');

    console.log('\nConfirmando que o anunciante foi excluído:');
    const confirmacao = await anuncianteController.listar();
    const aindaExiste = confirmacao.find(a => a.nome === novoAnunciante.nome);
    console.log(aindaExiste ? 'Anunciante ainda existe.' : 'Anunciante removido com sucesso.');
  } catch (error) {
    console.error('Erro ao testar anunciantes:', error.message);
  }
}

async function rodarTestes() {
  try {
    await db.conectar();
    console.log('Conectado ao MongoDB.');

    console.log('\n=== Testando Sites ===');
    await testarSites();

    console.log('\n=== Testando Usuários ===');
    await testarUsuarios();

    console.log('\n=== Testando Anunciantes ===');
    await testarAnunciantes();

    console.log('\nTodos os testes foram executados.');
  } catch (error) {
    console.error('Erro durante os testes:', error.message);
  } finally {
    await db.desconectar();
    console.log('Desconectado do MongoDB.');
  }
}

rodarTestes();

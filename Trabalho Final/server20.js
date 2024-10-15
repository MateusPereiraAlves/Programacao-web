const port = 3000;
const app = require('./app')

var module = require('./module');

const bcrypt = require('bcrypt');

// Um mapa que armazena as informações sobre o número de mesas que cada funcionário está atendendo
const tables = new Map();

const employeeTables = new Map();

const banco = require('./bd')

const db = banco.inicializa_banco()

const Produtos = [];
const employees = [];

banco.getProducts(Produtos)

banco.getEmployees(employeeTables, employees)

var nome = 'Logar'
var lotado = ''
var jaCadastrou = ''
var mesa;
var funcionario;
var obs = '';

var id_produtos_comprados = []
var qtd_produtos_comprados = []

app.get('/CompraFinalizada', function (req, res) { 
    banco.isertPedidos(id_produtos_comprados, qtd_produtos_comprados, nome, obs)
    res.redirect('/');
})

app.get('/cadastrar', function (req, res) { res.render('cadastrar.html', {jaCadastrou: req.session.jaCadastrou});})

app.get('/login', function (req, res) { res.render('Logar.html', {lotado: lotado}); })

app.get('/inicio', function (req, res) { res.render('inicio.html'); })

app.get('/TelaCompra', function (req, res) { 
  id = req.query.id.split(',');
  id = id.slice(0, -1)
  qtd = req.query.qtd.split(',');
  qtd = qtd.slice(0, -1)
  id_produtos_comprados = [...id].map(x => parseInt(x));
  qtd_produtos_comprados = [...qtd].map(x => parseInt(x));
  obs = req.query.obs
  res.render('TelaCompra.html', {produtos: Produtos, id_produtos_comprados: id_produtos_comprados, qtd_produtos_comprados:qtd_produtos_comprados});
});

app.get('/', (req, res) => {
    res.render('TelaCarrinho', {nome: nome, produtos: Produtos, mesa: mesa, funcionario: funcionario});
    console.log(req.session.login)
})

app.get('/entrar', (req, res) => {
  req.session.login = nome
  console.log(req.session.login)
  hasTable = module.assignTable(nome, employeeTables, employees, tables)
  if (!hasTable) {
    console.log("Não há mesas disponíveis!");
    lotado = "Não há mesas disponíveis!";
    res.redirect("/login")
  }
  else {
    module.assignTable(nome, employeeTables, employees, tables);
    for (const [customerName, table] of tables) {
        if (customerName == req.session.login) {
          const tableNumber = table.tableNumber;
          const employee = table.employee;
          mesa = tableNumber
          funcionario = employee
          banco.insertClienteMesa(tableNumber, customerName, employee)
          console.log(`Você (${customerName}) está alocado na mesa ${tableNumber} e será atendido(a) pelo funcionário(a) ${employee}.`);
        }
    }
    lotado = ''
    res.redirect("/");
  }
})

app.get('/destroy', function(req, res) {
    //Destroi a sessão (eu acho) e desvincula o cliente da mesa e funcionário
    if (nome != "Logar") {
      var mesa = tables.get(req.session.login).tableNumber;
      module.freeTable(mesa, employeeTables, tables)
    }
    nome = "Logar"
    req.session.login = undefined
    req.session.senha = undefined
    console.log('deslogado!')
    res.redirect("/");
    console.log("Obrigado pela prefência!")
});

app.post('/login', function (req, res) {
    login = req.body.login
    senha = req.body.passaword
  db.get(`SELECT senha FROM Clientes WHERE usuario = ?`, [login], (err, linha) => {
    if (err) {
      return console.error(err.message);
    }
    if (linha) {
      let senhas_iguais = bcrypt.compareSync(req.body.passaword, linha.senha)
      // Comparar a senha fornecida pelo usuário com a senha retornada pelo select
      console.log(senhas_iguais)
      console.log(linha.senha) 
      if (senhas_iguais) {
        console.log(req.body.passaword)
        console.log('Senha correta!');
        nome = req.body.login
        res.redirect("/entrar");
      } else {
        console.log('Senha incorreta!');
        res.redirect('/login')
      }
    } else {
      console.log(`Nenhum usuário com o nome de usuário "${req.body.login}" foi encontrado.`);
      res.redirect('/login')
    }
  });
});

app.post('/cadastrar', function (req, res) {
    var nome = req.body.nome
    var usuario = req.body.login;
    var senha = req.body.passaword;
    db.get(`SELECT senha FROM Clientes WHERE usuario = ?`, [req.body.login], (err, linha) => {
      if (err) {
        return console.error(err.message);
      }
      if (linha) {
          console.log('usuário já cadastrado')
          req.session.jaCadastrou = 'Usuario já cadastrado'
          res.redirect('/cadastrar')
      }
      else {
        // Gerar o hash da senha
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds);
        hash = bcrypt.hashSync(senha, salt)   
        console.log(hash) 
        var email = req.body.email;
        db.run(`INSERT INTO clientes (nome, usuario, senha, email) VALUES (?, ?, ?, ?)`, [nome, usuario, hash, email], function(err) {
          if (err) {
            return console.error(err.message);
          }
          console.log(`Dados do usuário inseridos com sucesso!`);
        });
        res.redirect('/login')
      }
    })
});

app.post('/inicio', function (req, res) {
    var nome = req.body.nome
    var email = req.body.email;
    var mensagem = req.body.mensagem;
    banco.insertFaleConosco(nome, email, mensagem)
    res.redirect('/inicio')
})

app.listen(port, () => {
    console.log('servidor rodando')
})
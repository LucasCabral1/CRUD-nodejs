/*
    *Arquivo: server.js
    *Descrição: Levantar o server para o aplicativo e integração com MongoDB
    *Author: Lucas Cabral
    *Data de Criação: 29/03/2021
    
*/ 
// setup da aplicação

// chamados dos pacotes
const express = require('express')
const app = express()
const bodyP = require('body-parser')
const mongoose = require('mongoose')
const Produto = require('./app/models/produto')


// conexão com o banco de dados : Mongodb

const uri = 'mongodb+srv://node-crud:1234@cluster-crud.xhzxf.mongodb.net/node-crud?retryWrites=true&w=majority'
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected…')
  
})
.catch(err => console.log(err))

// app para usar o Bodyparser
app.use(bodyP.urlencoded({ extended: true }))
app.use(bodyP.json())


// definindo porta e rotas
const port = process.env.PORT || 8000
const router = express.Router()

// *******************************************

router.use(function(req, res, next){
  console.log('Uma requisição foi concluida')
  next()
})


// Rota - middleware de roteamento
router.get('/', function(req,res){
    res.json({ message: 'Beleza, Bem vindo a nossa loja XYZ'})
})

// Rotas - '/produtos - GET ALL - Adicionar um novo produto/ 
router.route('/produtos')
    
    .post((req, res) =>{
      let produtos = new Produto()
      
      // configurar os campos do produtos
      produtos.id = req.body.id
      produtos.nome = req.body.nome
      produtos.preco = req.body.preco
      produtos.descricao = req.body.descricao


      // Método 1 - Criar Produto (POST http://localhost:8000/api/produtos)
      produtos.save((err) =>{

        try{
          res.json({ message: 'Produto Cadastrado com Sucesso'})

        }
        catch{
          res.json({message: `Erro ao tentar salvar o produto ${err}`})
         
        }
      })

    })


    // Método 2 - Selecionar todos produtos (GET http://localhost:8000/api/produtos)
      .get((req,res) =>{
        Produto.find((err, produtos) =>{
          
          try{
            res.json(produtos)
          }
          catch{
            res.send('Erro ao tentar selecionar os produtos ' + err)
          }
        })
    })


    // Declarar nova rota 
    router.route('/produtos/:produto_id')

    // Método 3 - Selecionar por Id (GET http://localhost:8000/api/produtos/produto_id)
      .get((req, res) =>{

        // selecionar um produto em especifico por Id
          Produto.findById(req.params.produto_id, (err, produto)=>{
            try{
              res.json(produto)
            }
            catch{
              res.send(`Produto não encontrado: ${err}`)
            }
          })
      })

      // Método 4 - Atualizar por Id (GET http://localhost:8000/api/produtos/produto_id)
      .put((req, res)=>{
          // Encontrar o Id
          Produto.findById(req.params.produto_id, (err, produto) =>{
            if(err){
              res.send(`Produto não encontrado: ${err}`)
            }

          // Pegar os atributos de produto
            produto.id = req.body.id
            produto.nome = req.body.nome
            produto.preco = req.body.preco
            produto.descricao = req.body.descricao

             // Alterar os dados e enviar para o MongoDb
            produto.save((err)=>{
              try{
                res.json({message: 'Produto atualizado'})
              }
              catch{
                res.send(`Erro ao atualzar o produto ${err}`)
              }
            })

          })

      })

      // Método 4 - Excluir por Id (GET http://localhost:8000/api/produtos/produto_id)
      .delete((req, res)=>{
        Produto.remove({
          _id: req.params.produto_id

        }, function(err){
          try{
            res.json({ message: 'Produto foi excluido com sucesso'})
          }
          catch{
            res.send(`Id do produto não encontrado`)
          }
        })

      })







// definindo o padrão de rota "/api"
app.use('', router)

// iniciando a aplicação
app.listen(port, () =>{
  console.log('iniciando app na porta ' +port)
})


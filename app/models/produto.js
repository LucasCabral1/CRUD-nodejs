/*
    *Arquivo: Produto.js
    *Descrição: Arquivo responsável por tratar o modelo do produto.
*/ 

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Classe produto - id, nome, preço, descrição

const produtoSchema = new Schema({
    id: Number,
    nome: String,
    preco: Number,
    descricao: String
})

module.exports = mongoose.model('Produto', produtoSchema)
const mongoose = require('mongoose');


const musicaSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    nome: String,
    url: String
});

const  gameSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    nome: String,
    imagem: String,
    categoria: String,
    musicas: [musicaSchema]
});

module.exports = mongoose.model('Game', gameSchema);
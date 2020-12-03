const express = require('express');
const router = express.Router();
const GameModel = require('../models/game_model');
const mongoose = require('mongoose');


router.get('/', async function (req, res) {
    try {
        const games = await GameModel
            .find({}, { _id: 1, nome: 1, imagem: 1, categoria: 1 })
            .exec()
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).send({ 'message': 'Erro ao buscar games' });

    }
});

router.post('/', async function (req, res) {
    try {
        const game_model = new GameModel({
            _id: mongoose.Types.ObjectId(),
            nome: req.body.nome,
            imagem: req.body.imagem,
            categoria: req.body.categoria,
            musicas: []
        });

        await game_model.save();
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send({ 'message': 'Erro ao cadastrar game' });

    }
});

router.put('/:id/musica', async function (req, res) {
    try {
        const gameUpdate = GameModel.findByIdAndUpdate(req.params['id'], {
            $push: {
                musicas: {
                    _id: mongoose.Types.ObjectId(),
                    nome: req.body.nome,
                    imagem: req.body.imagem,
                    url: req.body.url
                }
            }
        });
        await gameUpdate.exec()
        res.send({ 'message': 'Musica adicionada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ 'message': 'Erro ao cadastraR musica' });
    }
});


router.get('/:id', function (req, res) {
    GameModel
        .findById(req.params['id'])
        .exec()
        .then(doc => res.json(doc))
        .catch(err => {
            console.error(err);
            res.status(500).send({ 'message': 'Erro ao buscar game' })
        });

});
router.get('/musica/:id', async function (req, res) {
    try {
        const docGame = await GameModel.findOne({ 'musicas._id': req.params['id'] }, { 'musicas.$': 1 });

        if (docGame && docGame.musicas) {
            res.json(docGame.musicas[0]);
        } else {
            res.send({});
        }
    } catch (error) {
        console.error(err);
        res.send({});
    }
});
router.delete('/:id', async function (req, res) {
    try {
        await GameModel.findByIdAndRemove(req.params['id']).exec();
        res.send();
    } catch (error) {
        res.status(500).send({ 'message': 'Erro ao deletar game' });
    }
});
router.delete('/:id/musica/:musica', function (req, res) {
    GameModel.findByIdAndUpdate(req.params['id'], {
        $pull: {
            musicas: {
                _id: req.params['musica']
            }
        }
    }).exec().then((_) => res.send())
        .catch(err => {
            console.error(err);
            res.status(500).send({ 'message': 'Erro ao deletar musica' });
        });
});

module.exports = router;
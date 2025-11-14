import express from 'express';
import livrosController from '../controllers/livros.controller.js';

const router = express.Router();

router.get('/', livrosController.listarLivros);
router.get('/avaliacoes', livrosController.listarLivrosComAvaliacoes);
router.get('/:id', livrosController.buscarLivro);
router.post('/', livrosController.criarLivro);
router.put('/:id', livrosController.atualizarLivro);
router.delete('/:id', livrosController.excluirLivro);

export default router;
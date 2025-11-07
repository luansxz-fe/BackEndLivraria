import express from 'express';
import favoritosController from '../controllers/favoritos.controller.js';

const router = express.Router();

// GET /favoritos - Listar todos os favoritos
router.get('/', favoritosController.listarFavoritos);

// POST /favoritos - Adicionar livro aos favoritos
router.post('/', favoritosController.criarFavorito);

// DELETE /favoritos/:id - Remover favorito
router.delete('/:id', favoritosController.excluirFavorito);

export default router;
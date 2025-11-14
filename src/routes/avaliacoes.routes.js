import express from 'express';
import avaliacoesController from '../controllers/avaliacoes.controller.js';

const router = express.Router();

router.get('/', avaliacoesController.listarAvaliacoes);
router.post('/', avaliacoesController.criarAvaliacao);

export default router;
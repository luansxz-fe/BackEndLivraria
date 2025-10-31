import express from 'express';
import { listarAvaliacoes, criarAvaliacao } from '../controllers/avaliacoes.controller.js';

const router = express.Router();

router.get('/', listarAvaliacoes);
router.post('/', criarAvaliacao);

export default router;

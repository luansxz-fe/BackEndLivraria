import express from 'express';
import reservasController from '../controllers/reservas.controller.js';

const router = express.Router();

// GET /reservas - Listar todas as reservas
router.get('/', reservasController.listarReservas);

// POST /reservas - Criar nova reserva
router.post('/', reservasController.criarReserva);

// DELETE /reservas/:id - Excluir reserva
router.delete('/:id', reservasController.excluirReserva);

export default router;
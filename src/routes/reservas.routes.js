import express from 'express';
import reservasController from '../controllers/reservas.controller.js';

const router = express.Router();

router.get('/', reservasController.listarReservas);
router.get('/ativas', reservasController.listarReservasAtivas);
router.post('/', reservasController.criarReserva);
router.delete('/:id', reservasController.excluirReserva);

export default router;
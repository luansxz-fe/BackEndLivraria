import db from '../db.js';

const reservasController = {
  // Listar todas as reservas com dados do usuário e livro
  async listarReservas(req, res) {
    try {
      const query = `
        SELECT 
          r.*,
          u.nome as usuario_nome,
          u.email as usuario_email,
          l.titulo as livro_titulo,
          l.autor as livro_autor,
          l.ativo as livro_ativo
        FROM reservas r
        INNER JOIN usuarios u ON r.usuario_id = u.id
        INNER JOIN livros l ON r.livro_id = l.id
        ORDER BY r.criado_em DESC
      `;
      
      const [reservas] = await db.execute(query);
      
      res.status(200).json({
        success: true,
        data: reservas,
        total: reservas.length
      });
    } catch (error) {
      console.error('Erro ao listar reservas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao listar reservas'
      });
    }
  },

  // Criar nova reserva
  async criarReserva(req, res) {
    try {
      const { usuario_id, livro_id, data_retirada, data_devolucao } = req.body;

      // Validar campos obrigatórios
      if (!usuario_id || !livro_id || !data_retirada || !data_devolucao) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios: usuario_id, livro_id, data_retirada, data_devolucao'
        });
      }

      // Verificar se o livro está ativo
      const [livro] = await db.execute(
        'SELECT * FROM livros WHERE id = ? AND ativo = TRUE',
        [livro_id]
      );

      if (livro.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Livro não encontrado ou não está ativo para reserva'
        });
      }

      // Verificar se já existe reserva ativa para o mesmo livro
      const [reservaExistente] = await db.execute(
        `SELECT * FROM reservas 
         WHERE livro_id = ? AND data_devolucao >= CURDATE()`,
        [livro_id]
      );

      if (reservaExistente.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Livro já está reservado'
        });
      }

      // Inserir nova reserva
      const query = `
        INSERT INTO reservas (usuario_id, livro_id, data_retirada, data_devolucao)
        VALUES (?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        usuario_id,
        livro_id,
        data_retirada,
        data_devolucao
      ]);

      // Buscar dados completos da reserva criada
      const [novaReserva] = await db.execute(
        `SELECT r.*, u.nome as usuario_nome, l.titulo as livro_titulo 
         FROM reservas r
         INNER JOIN usuarios u ON r.usuario_id = u.id
         INNER JOIN livros l ON r.livro_id = l.id
         WHERE r.id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'Reserva criada com sucesso',
        data: novaReserva[0]
      });

    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao criar reserva'
      });
    }
  },

  // Excluir reserva
  async excluirReserva(req, res) {
    try {
      const { id } = req.params;

      // Verificar se a reserva existe
      const [reserva] = await db.execute(
        'SELECT * FROM reservas WHERE id = ?',
        [id]
      );

      if (reserva.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Reserva não encontrada'
        });
      }

      // Excluir reserva
      await db.execute(
        'DELETE FROM reservas WHERE id = ?',
        [id]
      );

      res.status(200).json({
        success: true,
        message: 'Reserva excluída com sucesso'
      });

    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao excluir reserva'
      });
    }
  }
};

export default reservasController;
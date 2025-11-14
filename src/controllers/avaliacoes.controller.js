import db from '../db.js';

const avaliacoesController = {
  async listarAvaliacoes(req, res) {
    try {
      const query = `
        SELECT 
          a.*,
          u.nome as usuario_nome,
          u.email as usuario_email,
          l.titulo as livro_titulo,
          l.autor as livro_autor
        FROM avaliacoes a
        INNER JOIN usuarios u ON a.usuario_id = u.id
        INNER JOIN livros l ON a.livro_id = l.id
        ORDER BY a.data_avaliacao DESC
      `;
      
      const [avaliacoes] = await db.execute(query);
      
      res.status(200).json({
        success: true,
        data: avaliacoes,
        total: avaliacoes.length
      });
    } catch (error) {
      console.error('Erro ao listar avaliações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao listar avaliações'
      });
    }
  },

  async criarAvaliacao(req, res) {
    try {
      const { usuario_id, livro_id, nota, comentario } = req.body;

      if (!usuario_id || !livro_id || !nota) {
        return res.status(400).json({
          success: false,
          message: 'Usuário, livro e nota são obrigatórios'
        });
      }

      if (nota < 0 || nota > 5) {
        return res.status(400).json({
          success: false,
          message: 'A nota deve estar entre 0 e 5'
        });
      }

      const [livro] = await db.execute('SELECT * FROM livros WHERE id = ? AND ativo = TRUE', [livro_id]);
      if (livro.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Livro não encontrado ou não está ativo'
        });
      }

      const [usuario] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [usuario_id]);
      if (usuario.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const query = `INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario) VALUES (?, ?, ?, ?)`;
      const [result] = await db.execute(query, [usuario_id, livro_id, nota, comentario]);

      const [novaAvaliacao] = await db.execute(
        `SELECT a.*, u.nome as usuario_nome, l.titulo as livro_titulo 
         FROM avaliacoes a
         INNER JOIN usuarios u ON a.usuario_id = u.id
         INNER JOIN livros l ON a.livro_id = l.id
         WHERE a.id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'Avaliação criada com sucesso',
        data: novaAvaliacao[0]
      });
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao criar avaliação'
      });
    }
  }
};

export default avaliacoesController;
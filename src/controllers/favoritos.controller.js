import db from '../db.js';

const favoritosController = {
  // Listar todos os favoritos com dados dos usuários e livros
  async listarFavoritos(req, res) {
    try {
      const query = `
        SELECT 
          f.*,
          u.nome as usuario_nome,
          u.email as usuario_email,
          l.titulo as livro_titulo,
          l.autor as livro_autor,
          l.ativo as livro_ativo
        FROM favoritos f
        INNER JOIN usuarios u ON f.usuario_id = u.id
        INNER JOIN livros l ON f.livro_id = l.id
        ORDER BY f.data_favoritado DESC
      `;
      
      const [favoritos] = await db.execute(query);
      
      res.status(200).json({
        success: true,
        data: favoritos,
        total: favoritos.length
      });
    } catch (error) {
      console.error('Erro ao listar favoritos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao listar favoritos'
      });
    }
  },

  // Adicionar livro aos favoritos
  async criarFavorito(req, res) {
    try {
      const { usuario_id, livro_id } = req.body;

      // Validar campos obrigatórios
      if (!usuario_id || !livro_id) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios: usuario_id, livro_id'
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
          message: 'Livro não encontrado ou não está ativo'
        });
      }

      // Verificar se já é favorito
      const [favoritoExistente] = await db.execute(
        'SELECT * FROM favoritos WHERE usuario_id = ? AND livro_id = ?',
        [usuario_id, livro_id]
      );

      if (favoritoExistente.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Livro já está nos favoritos deste usuário'
        });
      }

      // Inserir novo favorito
      const query = `
        INSERT INTO favoritos (usuario_id, livro_id)
        VALUES (?, ?)
      `;
      
      const [result] = await db.execute(query, [usuario_id, livro_id]);

      // Buscar dados completos do favorito criado
      const [novoFavorito] = await db.execute(
        `SELECT f.*, u.nome as usuario_nome, l.titulo as livro_titulo 
         FROM favoritos f
         INNER JOIN usuarios u ON f.usuario_id = u.id
         INNER JOIN livros l ON f.livro_id = l.id
         WHERE f.id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'Livro adicionado aos favoritos com sucesso',
        data: novoFavorito[0]
      });

    } catch (error) {
      console.error('Erro ao criar favorito:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao criar favorito'
      });
    }
  },

  // Remover livro dos favoritos
  async excluirFavorito(req, res) {
    try {
      const { id } = req.params;

      // Verificar se o favorito existe
      const [favorito] = await db.execute(
        'SELECT * FROM favoritos WHERE id = ?',
        [id]
      );

      if (favorito.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Favorito não encontrado'
        });
      }

      // Excluir favorito
      await db.execute(
        'DELETE FROM favoritos WHERE id = ?',
        [id]
      );

      res.status(200).json({
        success: true,
        message: 'Favorito removido com sucesso'
      });

    } catch (error) {
      console.error('Erro ao excluir favorito:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao excluir favorito'
      });
    }
  }
};

export default favoritosController;
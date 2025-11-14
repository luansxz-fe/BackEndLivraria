import db from '../db.js';

const livrosController = {
  async listarLivros(req, res) {
    try {
      const query = `SELECT * FROM livros WHERE ativo = TRUE ORDER BY criado_em DESC`;
      const [livros] = await db.execute(query);
      
      res.status(200).json({
        success: true,
        data: livros,
        total: livros.length
      });
    } catch (error) {
      console.error('Erro ao listar livros:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao listar livros'
      });
    }
  },

  async buscarLivro(req, res) {
    try {
      const { id } = req.params;
      const query = `SELECT * FROM livros WHERE id = ? AND ativo = TRUE`;
      const [livros] = await db.execute(query, [id]);

      if (livros.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Livro não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: livros[0]
      });
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar livro'
      });
    }
  },

  async criarLivro(req, res) {
    try {
      const { titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse } = req.body;

      if (!titulo || !autor) {
        return res.status(400).json({
          success: false,
          message: 'Título e autor são obrigatórios'
        });
      }

      const query = `INSERT INTO livros (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await db.execute(query, [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse]);

      const [novoLivro] = await db.execute('SELECT * FROM livros WHERE id = ?', [result.insertId]);

      res.status(201).json({
        success: true,
        message: 'Livro criado com sucesso',
        data: novoLivro[0]
      });
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao criar livro'
      });
    }
  },

  async atualizarLivro(req, res) {
    try {
      const { id } = req.params;
      const { titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo } = req.body;

      const [livroExistente] = await db.execute('SELECT * FROM livros WHERE id = ?', [id]);
      if (livroExistente.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Livro não encontrado'
        });
      }

      const query = `UPDATE livros SET titulo=?, autor=?, genero=?, editora=?, ano_publicacao=?, isbn=?, idioma=?, formato=?, caminho_capa=?, sinopse=?, ativo=? WHERE id=?`;
      await db.execute(query, [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo, id]);

      const [livroAtualizado] = await db.execute('SELECT * FROM livros WHERE id = ?', [id]);

      res.status(200).json({
        success: true,
        message: 'Livro atualizado com sucesso',
        data: livroAtualizado[0]
      });
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao atualizar livro'
      });
    }
  },

  async excluirLivro(req, res) {
    try {
      const { id } = req.params;
      const [livro] = await db.execute('SELECT * FROM livros WHERE id = ?', [id]);

      if (livro.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Livro não encontrado'
        });
      }

      await db.execute('UPDATE livros SET ativo = FALSE WHERE id = ?', [id]);

      res.status(200).json({
        success: true,
        message: 'Livro excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao excluir livro'
      });
    }
  },

  async listarLivrosComAvaliacoes(req, res) {
    try {
      const query = `
        SELECT 
          l.id,
          l.titulo,
          l.autor,
          l.genero,
          COUNT(a.id) as total_avaliacoes,
          COALESCE(AVG(a.nota), 0) as media_notas
        FROM livros l
        LEFT JOIN avaliacoes a ON l.id = a.livro_id
        WHERE l.ativo = TRUE
        GROUP BY l.id, l.titulo, l.autor, l.genero
        ORDER BY media_notas DESC
      `;
      
      const [livros] = await db.execute(query);
      res.status(200).json({
        success: true,
        data: livros,
        total: livros.length
      });
    } catch (error) {
      console.error('Erro ao listar livros com avaliações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao listar livros com avaliações'
      });
    }
  }
};

export default livrosController;
import db from '../db.js';

export const listarLivros = async (req, res) => {
  try {
    const [livros] = await db.query('SELECT * FROM livros WHERE ativo = TRUE');
    res.json(livros);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const buscarLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const [livro] = await db.query('SELECT * FROM livros WHERE id = ?', [id]);
    if (livro.length === 0) return res.status(404).json({ erro: 'Livro não encontrado' });
    res.json(livro[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const criarLivro = async (req, res) => {
  try {
    const { titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse } = req.body;
    const [result] = await db.query(
      `INSERT INTO livros 
        (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse]
    );
    const [novoLivro] = await db.query('SELECT * FROM livros WHERE id = ?', [result.insertId]);
    res.status(201).json(novoLivro[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const atualizarLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo } = req.body;
    await db.query(
      `UPDATE livros SET titulo=?, autor=?, genero=?, editora=?, ano_publicacao=?, isbn=?, idioma=?, formato=?, caminho_capa=?, sinopse=?, ativo=? WHERE id=?`,
      [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo, id]
    );
    const [livroAtualizado] = await db.query('SELECT * FROM livros WHERE id = ?', [id]);
    res.json(livroAtualizado[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const excluirLivro = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM livros WHERE id = ?', [id]);
    res.json({ mensagem: 'Livro excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};


export const livrosComAvaliacoes = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT l.titulo, 
             ROUND(AVG(a.nota),2) AS media_notas, 
             COUNT(a.id) AS total_avaliacoes
      FROM livros l
      LEFT JOIN avaliacoes a ON l.id = a.livro_id
      GROUP BY l.id
    `);
    res.json(result);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

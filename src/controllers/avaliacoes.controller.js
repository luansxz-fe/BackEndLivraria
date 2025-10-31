import db from '../db.js';

export const listarAvaliacoes = async (req, res) => {
  try {
    const [avaliacoes] = await db.query(`
      SELECT a.id, u.nome AS usuario, l.titulo AS livro, a.nota, a.comentario, a.data_avaliacao
      FROM avaliacoes a
      JOIN usuarios u ON a.usuario_id = u.id
      JOIN livros l ON a.livro_id = l.id
    `);
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const criarAvaliacao = async (req, res) => {
  try {
    const { usuario_id, livro_id, nota, comentario } = req.body;
    const [result] = await db.query(
      `INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario) VALUES (?, ?, ?, ?)`,
      [usuario_id, livro_id, nota, comentario]
    );
    const [novaAvaliacao] = await db.query('SELECT * FROM avaliacoes WHERE id = ?', [result.insertId]);
    res.status(201).json(novaAvaliacao[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

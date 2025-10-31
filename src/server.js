import express from 'express';
import livrosRoutes from './routes/livros.routes.js';
import avaliacoesRoutes from './routes/avaliacoes.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/livros', livrosRoutes);
app.use('/avaliacoes', avaliacoesRoutes);
app.use('/usuarios', usuariosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

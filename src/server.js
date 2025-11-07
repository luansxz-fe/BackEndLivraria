import express from 'express';
import livrosRoutes from './routes/livros.routes.js';
import avaliacoesRoutes from './routes/avaliacoes.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import favoritosRoutes from './routes/favoritos.routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Rotas
app.use('/livros', livrosRoutes);
app.use('/avaliacoes', avaliacoesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/reservas', reservasRoutes);
app.use('/favoritos', favoritosRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota padrão
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API da Biblioteca!',
    endpoints: {
      livros: '/livros',
      avaliacoes: '/avaliacoes',
      usuarios: '/usuarios',
      reservas: '/reservas',
      favoritos: '/favoritos',
      health: '/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

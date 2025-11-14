import express from 'express';
import livrosRoutes from './routes/livros.routes.js';
import avaliacoesRoutes from './routes/avaliacoes.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import favoritosRoutes from './routes/favoritos.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/livros', livrosRoutes);
app.use('/avaliacoes', avaliacoesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/reservas', reservasRoutes);
app.use('/favoritos', favoritosRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

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
    },
    endpoints_extras: {
      livros_avaliacoes: '/livros/avaliacoes',
      reservas_ativas: '/reservas/ativas',
      favoritos_usuario: '/favoritos/usuario/{id}'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

app.use((error, req, res, next) => {
  console.error('Erro no servidor:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

app.listen(PORT, () => {
  console.log(`=== SERVIDOR INICIADO ===`);
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Data/Hora: ${new Date().toLocaleString()}`);
  console.log(`========================`);
});
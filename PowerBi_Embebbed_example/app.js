const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Defina a rota padrão para a raiz do seu aplicativo
app.get('/', (req, res) => {
  res.send('Bem-vindo ao seu aplicativo!');
});
// Importe e use seu roteador de relatórios
const indexRouter = require('./Router/index');
app.use('/', indexRouter);
// Inicie o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
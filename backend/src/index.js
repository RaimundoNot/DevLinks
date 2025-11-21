const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

// Inicializa Firebase Admin
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- Rotas de autenticação ----------------

// Cadastro de usuário
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await auth.createUser({ email, password });
    res.send({ uid: userRecord.uid, email: userRecord.email });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro ao criar usuário' });
  }
});

// Login de usuário (gera token customizado)
app.post('/login', async (req, res) => {
  const { uid } = req.body;

  try {
    const token = await auth.createCustomToken(uid);
    res.send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro ao gerar token' });
  }
});

// ---------------- Rotas de links ----------------

// Salvar link
app.post('/users/:uid/links', async (req, res) => {
  const { uid } = req.params;
  const { url, title } = req.body;

  try {
    await db.collection('users').doc(uid).collection('links').add({ url, title });
    res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro ao salvar link' });
  }
});

// Listar links
app.get('/users/:uid/links', async (req, res) => {
  const { uid } = req.params;

  try {
    const snapshot = await db.collection('users').doc(uid).collection('links').get();
    const links = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(links);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro ao buscar links' });
  }
});

// Excluir link
app.delete('/users/:uid/links/:linkId', verificarToken, async (req, res) => {
  if (req.uid !== req.params.uid) {
    return res.status(403).send({ error: 'Acesso negado' });
  }

  const { uid, linkId } = req.params;

  try {
    await db.collection('users').doc(uid).collection('links').doc(linkId).delete();
    res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro ao excluir link' });
  }
});

// ---------------- Inicialização ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Middleware para verificar token
async function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).send({ error: 'Token não fornecido' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.uid = decodedToken.uid; // guarda o UID do usuário
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: 'Token inválido' });
  }
}

// Rotas protegidas
app.post('/users/:uid/links', verificarToken, async (req, res) => {
  if (req.uid !== req.params.uid) {
    return res.status(403).send({ error: 'Acesso negado' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).send({ error: 'URL não fornecida' });
  }

  try {
    const docRef = await db
      .collection('users')
      .doc(req.params.uid)
      .collection('links')
      .add({ url });

    res.send({ id: docRef.id, url });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro ao salvar link' });
  }
});

app.get('/users/:uid/links', verificarToken, async (req, res) => {
  if (req.uid !== req.params.uid) {
    return res.status(403).send({ error: 'Acesso negado' });
  }
  // ... listar links
});
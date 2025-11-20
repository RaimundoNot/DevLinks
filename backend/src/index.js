const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

// Inicializa Firebase Admin com a chave privada
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Rota de teste: salvar link de usuário
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

// Rota de teste: listar links
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
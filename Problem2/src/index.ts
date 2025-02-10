import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Express2!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
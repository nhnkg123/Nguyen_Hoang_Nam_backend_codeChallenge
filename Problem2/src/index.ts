import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import {Repository} from './Repository/Repository'
import indexRouter from './routes/indexRouter';
import userRouter from './routes/userRouter';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/', indexRouter);
app.use('/users', userRouter);

try {
  const db = Repository.getDb().then((res) => {
    if (res.collections.length > 0) {
      console.log(`Successfully connected to the database: ${res.databaseName}`);
    }
  });

} catch (error) {
  console.error('Error connecting to the database:', error);
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
import express = require('express');
import morgan = require('morgan');
import cors = require('cors');

import { ClientProvider } from './db/ClientProvider';
import postRouter from './routers/post.router';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors())

app.use('/posts', postRouter);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.on("error", async (err) => {
  console.log("Error: ", err);
  await ClientProvider.getClient().close();
  process.exit(1);
});

app.on("close", async () => {
  await ClientProvider.getClient().close();
  process.exit(0);
});

app.on("finish", async () => {
  await ClientProvider.getClient().close();
  process.exit(0);
});
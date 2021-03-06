if (process.env.NODE_ENV === 'dev') {
  require('dotenv').config();
  console.log('dotenv GO!GO!GO!');
}

const {createTable, sendEvent, searchEvent} = require('./libs/db-utils');
const {signS3} = require('./libs/upload-utils');
const cors = require('cors');
const express = require('express');
const path = require('path');
const formidableMiddleware = require('express-formidable');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(formidableMiddleware());

// app.get('/create-db', createTable);

app.get('/api/events', searchEvent);
app.post('/api/events', sendEvent);

app.get('/api/sign-s3', signS3);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));


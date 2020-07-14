const {createTable, insertData} = require('./libs/db-utils');
const {Pool} = require('pg');
const cors = require('cors');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/create-db', createTable);

app.post('/api/events', insertData);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));


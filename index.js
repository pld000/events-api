const {createTable, sendEvent, searchEvent} = require('./libs/db-utils');
const cors = require('cors');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// app.get('/create-db', createTable);

app.get('/api/events', searchEvent);
app.post('/api/events', sendEvent);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));


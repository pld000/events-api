const {Pool} = require('pg');
const {
  CREATE_TABLE_SCRIPT,
  INSERT_DATA_SCRIPT,
  SEARCH_EVENTS_SCRIPT
} = require('./db-scripts');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

const createTable = async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query(CREATE_TABLE_SCRIPT);
    client.release();
    return res.send('Ok!!');
  } catch (err) {
    console.log(err);
    res.send('Error ' + err);
  }
};

const sendEvent = (req, res) => {
  const {body} = req;
  const query = {
    text: INSERT_DATA_SCRIPT,
    values: [body.fio, body.department, body.theme, body.content, body.file, body.date, body.time]
  };

  return _makePgQuery(req, res, query)
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log(err);
      res.send('Error ' + err);
    });
};

const searchEvent = (req, res) => {
  const {q} = req.query;
  const query = {
    text: SEARCH_EVENTS_SCRIPT,
    values: [q],
  };

  return _makePgQuery(req, res, query)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(err);
      res.send('Error ' + err);
    });
};

const _makePgQuery = (req, res, query) => {
  return pool.connect()
    .then((client) => client.query(query))
};

module.exports = {
  createTable,
  sendEvent,
  searchEvent
};


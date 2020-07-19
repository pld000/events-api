const {Pool} = require('pg');
const aws = require('aws-sdk');

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

const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-east-2';

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
  const fields = req.fields;
  const files = req.files;

  const query = {
    text: INSERT_DATA_SCRIPT,
    values: [
      fields.fio, fields.department, fields.theme, fields.content, fields.file, fields.date, fields.time
    ]
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


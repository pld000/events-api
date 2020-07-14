const {Pool} = require('pg');
const {CREATE_TABLE_SCRIPT, INSERT_DATA_SCRIPT} = require('./db-scripts');

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

const insertData = async (req, res) => {
  const {body} = req;
  const query = {
    text: INSERT_DATA_SCRIPT,
    values: [body.fio, body.department, body.theme, body.content, body.file, body.date, body.time]
  };
  try {
    const client = await pool.connect();
    const result = await client.query(query);

    return res.send(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.send('Error ' + err);
  }
};

module.exports = {
  createTable,
  insertData
};

// const dbPage = async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM test_table');
//     const results = {'results': (result ? result.rows : null)};
//     res.render('pages/db', results);
//     // res.send(results)
//     client.release();
//   } catch (err) {
//     console.log(err);
//     res.send('Error ' + err);
//   }
// };

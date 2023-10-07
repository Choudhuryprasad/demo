const express = require('express')
// const http = require('http');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mysql')

app.use(cors())
app.use(bodyParser.json())

app.post('/sendData', (req, res) => {
     let username = req.body.username;
     let password = req.body.password;

     const conn = sql.createConnection({
          host: 'localhost',
          user: 'root',
          password: 'password',
          database: 'demo'
     })

     conn.query('insert into record(username, password) values(?,?)', [username, password], err => {
          if (err) throw err;
          res.send(true)
          console.log('data inserted')
     })


     const userEnteredPassword = '${password}';

     // Fetch password from the database based on a user identifier (e.g., username or email)
     const userIdentifier = '${username}'; // replace with the actual identifier
     const sqlQuery = `SELECT password FROM record WHERE username = ?`;

     conn.query(sqlQuery, [userIdentifier], (err, results) => {
          if (err) {
               console.error('Error executing query:', err);
               conn.end();
               return;
          }

          // Check if there are results
          if (results.length > 0) {
               const dbPassword = results[0].password;

               // Compare the fetched password with the user-entered password
               if (userEnteredPassword === dbPassword) {
                    console.log('Passwords matched');
               } else {
                    console.log('Passwords do not match');
               }
          } else {
               console.log('User not found');
          }

          conn.end();
     });

})



app.listen(3002, err => {
     if (err) throw err;
     console.log('server started')
})
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./config/routes');
const errorHandler = require('./lib/errorHandler');

const app = express();

const { port, dbURI } = require('./config/environment');

//Mongoose
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(dbURI);

app.use(express.static(`${__dirname}/public`));

//Middelware
app.use(bodyParser.json());

// CORS header
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api', router);
app.use(errorHandler);

// app.get('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

// *************************************************************
//                        MONZO TEST CODE
// *************************************************************

const request = require('request');

const oauthDetails = {
  client_id: 'oauth2client_00009ZwDIYexsmCFEpJO09',
  client_secret: 'mnzpub.nLYRcNz2lKr9XsltNdJXbUygVSci/He9xp3REApCNyfGwPaqNoVQdJN/Z/KMRXlBxip7dSUFcQaZrjkzYWYH',
  redirect_uri: 'http://localhost:4000/oauth/callback'
};

// Will be populated once received
let accessToken = null;

app.get('/monzo', (req, res) => {
  const { client_id, redirect_uri } = oauthDetails;
  const monzoAuthUrl = 'https://auth.monzo.com';
  res.type('html');
  res.send(`
    <h1>Hello</h1>
    <form action="${monzoAuthUrl}">
      <input type="hidden" name="client_id" value="${client_id}" />
      <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
      <input type="hidden" name="response_type" value="code" />
      <button>Sign in</button>
    </form>
  `);
});

app.get('/oauth/callback', (req, res) => {
  const { client_id, client_secret, redirect_uri } = oauthDetails;
  const { code } = req.query;
  const monzoAuthUrl = `https://api.monzo.com/oauth2/token`;

  // Initiate request to retrieve access token
  request.post({
    url: monzoAuthUrl,
    form: {
      grant_type: 'authorization_code',
      client_id,
      client_secret,
      redirect_uri,
      code
    }
  }, (err, response, body) => {
    accessToken = JSON.parse(body); // Populate accessToken variable with token response
    res.redirect('/accounts'); // Send user to their accounts
  });
});

app.get('/accounts', (req, res) => {
  const { token_type, access_token } = accessToken;
  const accountsUrl = 'https://api.monzo.com/accounts';

  request.get(accountsUrl, {
    headers: {
      Authorization: `${token_type} ${access_token}`
    }
  }, (req, response, body) => {
    const { accounts } = JSON.parse(body);

    res.type('html');
    res.write('<h1>Accounts</h1><ul>');

    for(let account of accounts) {
      const {id, type, description } = account;
      res.write(`
        <li>
          ${description}(<i>${type}</i>) - <a href="/transactions/${id}">View transaction history</a>
        </li>
      `);
    }

    res.end('</ul>');
  });
});


// *************************************************************
// *************************************************************

app.listen(port, () => console.log(`Express is running on port ${port}`));

module.exports = app;

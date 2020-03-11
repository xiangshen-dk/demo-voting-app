// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('promise-mysql');

let pool;
const createPool = async () => {
  pool = await mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  });
};
createPool();

const app = express();
app.set('view engine', 'pug');
app.enable('trust proxy');

// Automatically parse request body as form data.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set Content-Type for all responses for these routes.
app.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});


const getRecentVotes = async () => {
  return pool.query(
      'SELECT candidate, time_cast FROM votes ORDER BY time_cast DESC LIMIT 5'
  );
};

const getTabCount = async () => {
  const stmt = 'SELECT COUNT(vote_id) as count FROM votes WHERE candidate=?';
  const [tabsVotes] = await pool.query(stmt, ['TABS']);
  return tabsVotes.count;
};

const getSpaceCount = async () => {
  const stmt = 'SELECT COUNT(vote_id) as count FROM votes WHERE candidate=?';
  const [spacesVotes] = await pool.query(stmt, ['SPACES']);
  return spacesVotes.count;
};

const castVote = async (vote) => {
  const stmt = 'INSERT INTO votes (time_cast, candidate) VALUES (?, ?)';
  return pool.query(stmt, [vote.time_cast, vote.candidate]);
};

// Serve the index page, showing vote tallies.
app.get('/', async (req, res) => {
  const recentVotes = await getRecentVotes();
  const tabCount = await getTabCount();
  const spaceCount = await getSpaceCount();

  let winnerHeader;
  if (tabCount > spaceCount) {
    const diff = tabCount - spaceCount;
    winnerHeader = `TABS are winning by ${diff} votes!`;
  } else if (spaceCount > tabCount) {
    const diff = spaceCount - tabCount;
    winnerHeader = `SPACES are winning by ${diff} votes!`;
  } else {
    winnerHeader = 'TABS and SPACES are evenly matched!';
  }

  res.render('index.pug', {
    recentVotes,
    tabCount: tabCount,
    spaceCount: spaceCount,
    winnerHeader: winnerHeader
  });
});

// Handle incoming vote requests and inserting them into the database.
app.post('/', async (req, res) => {
  const {team} = req.body;
  const timestamp = new Date();

  if (!team || (team !== 'TABS' && team !== 'SPACES')) {
    res.status(400).send('Invalid team specified.').end();
  }

  try {
    await castVote({time_cast: timestamp, candidate: team});
  } catch (err) {
    res.status(500).send('Unable to successfully cast vote!').end();
  }

  res.status(200).send(`Successfully voted for ${team} at ${timestamp}`).end();
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = server;

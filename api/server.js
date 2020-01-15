const express = require('express');
const Db = require('../data/db');
const router = require('../router/router')
const server = express();
server.use(express.json());
server.use('/api/posts', router);

module.exports = server;
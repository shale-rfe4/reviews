const express = require('express');
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'atelier',
  port: 5432
});

client.connect();

// const query = `
// select * from reviews
// where product_id=24;`;

// client.query(query, (err, result) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(result);
//   }
// })
exports.client = client;
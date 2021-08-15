const express = require('express');
const { client } = require('./database')
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());
const port = 3000;
app.get('/', (req, res) => {
  res.send('hello world');
})

app.get('/reviews/:productId', (req, res) => {
  const product_id = req.params.productId;
  const query = `
    SELECT * FROM reviews
    WHERE product_id=${product_id}`
  client.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result)
    }
  })
})

app.get('/reviews/meta/:productId', (req, res) => {
  const product_id = req.params.productId;
  const query = `
    SELECT name, AVG(value) FROM
    characteristic_reviews join characteristics
    on characteristics.id=characteristic_id where
    characteristics.product_id=${product_id}
    group by name`;
  client.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const query = `
      SELECT rating, COUNT(rating) FROM reviews
      where product_id=${product_id}
      GROUP BY rating`;
      client.query(query, (err, ratings) => {
        if (err) {
          res.send(err);
        } else {
          const query = `
          SELECT recommend, COUNT(recommend) FROM reviews
          WHERE product_id=${product_id}
          GROUP BY recommend`;
          client.query(query, (err, recommend) => {
            if (err) {
              res.send(err);
            } else{
              res.send(JSON.stringify({
                product_id: product_id,
                ratings: ratings.rows,
                characteristics: result.rows,
                recommended: recommend.rows
              }))

            }
          })
        }
      })
    }
  })
})

app.post('/reviews', (req, res) => {
  // const product_id = req.body.product_id;
  res.send(req.body);
})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
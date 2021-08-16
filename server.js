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
  const product_id = req.body.product_id;
  const rating = req.body.rating;
  const summary = req.body.summary;
  const body = req.body.body;
  const recommend = req.body.recommend;
  const name = req.body.name;
  const email = req.body.email;
  const characteristics = req.body.characteristics;
  const date = Date.now();
  const helpfulness = 3;
  const reported = 'false';
  const response = '';
  console.log('photos: ', req.body.photos)
  const photos = req.body.photos;
  const query = `INSERT INTO reviews
  (rating, summary, recommend, body, date, reviewer_name, helpfulness, product_id, reviewer_email, reported, response)
    values ('${rating}', '${summary}', '${recommend}', '${body}',
    '${date}', '${name}', '${helpfulness}', '${product_id}',
    '${email}', '${reported}', '${response}')
    returning *`
  client.query(query)
    .then(result => {
      let reviewId = result.rows[0].id;
      if (photos.length > 0) {
        let photoQuery = `
        insert into photos (review_id, url)
        values ('${reviewId}', $1)`
        photos.forEach(photo => client.query(photoQuery, [photo])
                              .then(result => console.log('here we are: ', result.rows))
                              .catch(err => console.log(err)))
        console.log('hi!!!!!!!!!!!!!!!!!!!')
      }

      res.send('success')})
    .catch(err => {
      console.log(err);
      res.send('error');
    })
})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
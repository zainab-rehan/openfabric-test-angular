const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));


app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");

  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post('/products',(req, res, next)=>{
  const product = req.body;
  console.log(product);
  res.status(201).json({
    message:'Product added successfully!'
  });
});


app.get('/products',(req, res, next)=>{
  const products= [
    {
      id: '1',
      name: 'Etsy',
      owner: 'Zainab',
      cost:'30',
      desc: 'Learn to sell'
    },
    {
      id: '2',
      name: 'Driving',
      owner: 'Hamza',
      cost:'20',
      desc: 'Learn to drive'
    },
    {
      id: '3',
      name: 'Writing',
      owner: 'Amna',
      cost:'10',
      desc: 'Learn to write'
    }
  ]


  res.status(200).json({
    message:'Products fetch successfully!',
    products:products
  });

 });

 module.exports = app;

//2OEiubfdOvjvqczP

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Product = require('./models/product');

const app = express();

mongoose.connect("mongodb+srv://zainabrehanzrh:2OEiubfdOvjvqczP@cluster0.hfjvegu.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
  console.log("Connected to the database!!");
})
.catch(()=>{
  console.log("Connection Failed to the database!!");
});

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
  const product = new Product({
    name : req.body.name,
    owner :req.body.owner,
    cost : req.body.cost,
    desc : req.body.desc
  });
  console.log(product);
  product.save();
  res.status(201).json({
    message:'Product added successfully!'
  });
});


app.get('/products',(req, res, next)=>{
  Product.find()
  .then(documents => {
    console.log(documents);
    res.status(200).json({
      message:'Products fetch successfully!',
      products:documents
    });

  });
 });

 module.exports = app;

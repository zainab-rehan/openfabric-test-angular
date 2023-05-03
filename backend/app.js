const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./routes/products');
const userRoutes = require('./routes/user');

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
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");

  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS "
  );
  next();
});

app.use('/products',productRoutes);
app.use('/user',userRoutes);


module.exports = app;

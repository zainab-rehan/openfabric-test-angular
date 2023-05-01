const express = require('express');
const Product = require('../models/product');
const router = express.Router();


router.post('',(req, res, next)=>{
  const product = new Product({
    name : req.body.name,
    owner :req.body.owner,
    cost : req.body.cost,
    desc : req.body.desc
  });
  console.log(product);
  product.save().then(savedProduct => {
    res.status(201).json({
      message:'Product added successfully!',
      productId: savedProduct._id
    });
  });
});


router.get('',(req, res, next)=>{
  Product.find()
  .then(documents => {
    console.log(documents);
    res.status(200).json({
      message:'Products fetch successfully!',
      products:documents
    });

  });
});

router.get('/:id',(req, res, next)=>{
Product.findById(req.params.id)
.then(product => {
  if(product){
    res.status(200).json(product);
  } else {
    res.status(404).json({
      message:'Product not found!'
    });
  }
});
});

router.put('/:id',(req, res, next)=>{
const product = new Product({
  _id : req.body.id,
  name : req.body.name,
  owner :req.body.owner,
  cost : req.body.cost,
  desc : req.body.desc
});
  Product.updateOne({_id:req.params.id},product).then( result =>{
    console.log(result);
    res.status(200)
    .json({message:'Product updated successfuly!'});
  });
});

router.delete('/:id', (req, res ,next)=>{
Product.deleteOne({_id : req.params.id})
  .then(result =>{
    console.log(result);
    res.status(200)
    .json({message:'Product deleted successfuly!'});
  });
});

module.exports = router;

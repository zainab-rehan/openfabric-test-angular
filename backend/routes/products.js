const express = require('express');
const multer = require('multer');

const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png' :'png',
  'image/jpeg' :'jpeg',
  'image/jpg' :'jpg'
};
const storage = multer.diskStorage({
  destination : (req, file, cb)=>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid Mime Type!');
    if(isValid){
      error = null;
    }
    cb(null, "backend/images");
  },
  filename : (req, file, cb)=>{
   const name = file.originalname.toLowerCase().split(" ").join("-");
   const ext = MIME_TYPE_MAP[file.mimetype];
   cb(null, name +'-'+Date.now()+'.'+ext);
  },
});

router.post('',
  checkAuth,
  multer({storage: storage}).single("image"),
  (req, res, next)=>{
    const url = req.protocol + "://" + req.get("host");
    const product = new Product({
      name : req.body.name,
      owner :req.body.owner,
      cost : req.body.cost,
      desc : req.body.desc,
      imagePath : url + '/images/' + req.file.filename
    });
    product.save().then(savedProduct => {
      res.status(201).json({
        message:'Product added successfully!',
        product :{
          ...savedProduct,
          id: savedProduct._id
        }
      });
    });
});


router.get('',(req, res, next)=>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const productQuery = Product.find();
  let fetchedProducts;
  if(pageSize && currentPage){
    productQuery
    .skip(pageSize *(currentPage - 1))
    .limit(pageSize);
  }
  productQuery.then(documents => {
    fetchedProducts = documents;
   return Product.count()

  }).then(count => {
    res.status(200).json({
      message:'Products fetch successfully!',
      products:fetchedProducts,
      maxProducts:count
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

router.put('/:id',
  checkAuth,
  multer({storage: storage}).single("image"),(req, res, next)=>{
    let imagePath = req.body.imagePath;
    if(req.file){
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + '/images/' + req.file.filename;
    }
    const product = new Product({
      _id : req.body.id,
      name : req.body.name,
      owner :req.body.owner,
      cost : req.body.cost,
      desc : req.body.desc,
      imagePath: imagePath
    });
    Product.updateOne({_id:req.params.id},product).then( result =>{
      res.status(200)
      .json({message:'Product updated successfuly!'});
    });
});

router.delete('/:id',checkAuth, (req, res ,next)=>{
Product.deleteOne({_id : req.params.id})
  .then(result =>{
    res.status(200)
    .json({message:'Product deleted successfuly!'});
  });
});

module.exports = router;

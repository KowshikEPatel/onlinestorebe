const router = require("express").Router();
const Product = require("../models/product");

//CREATE Product
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const product = await newProduct.save();
    res.status(200).json(product);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//UPDATE Product
router.put("/", async (req, res) => {
    
    try {
      const updatedproduct = await Product.findByIdAndUpdate(
        req.body._id,
        {
          $set: req.body.productdata,
        },
        { new: true }
      );
      res.status(200).json(updatedproduct);
    } catch (err) {
      res.status(500).json(err);
    } 
});

//DELETE Product
router.delete("/:id", async (req, res) => {

    try {
      const product = await Product.findByIdAndDelete(req.params.id)
      res.status(200).json("product deleted");
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }  
});

//GET Product
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL Product
router.get("/all/:page", async (req, res) => {
  try {
    let products = await Product.find().limit(10);
    res.status(200).json(products);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//GET search Product
router.get("/key/",async(req,res)=>{
  console.log(req.query.search)
  try{
      let products  = await Product.find({"smallcase": { $regex: '.*' + req.query.search + '.*' }}).limit(10);
      res.status(200).json(products);
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
  

});


module.exports = router;

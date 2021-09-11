const router = require("express").Router();
const Bill = require("../models/bill");

//CREATE Bill
router.post("/", async (req, res) => {
  const newBill = new Bill(req.body);
  try {
    const savedBill = await newBill.save();
    res.status(200).json(savedBill);
  } catch (err) {
    
    res.status(500).json(err);
  }
});

//UPDATE Bill
router.put("/", async (req, res) => {
    
  try {
    const updatedBill = await Bill.findByIdAndUpdate(
      req.body._id,
      {
        $set: req.body.billdata,
      },
      { new: true }
    );
    res.status(200).json(updatedBill);
  } catch (err) {
    res.status(500).json(err);
  } 
});

//DELETE Bills
router.delete("/:id", async (req, res) => {

  try {
    const bill = await Bill.findByIdAndDelete(req.params.id)
    res.status(200).json("product deleted");
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }  
});

//GET Bills
router.get("/:id", async (req, res) => {
try {
  const bill = await Bill.findById(req.params.id);
  res.status(200).json(bill);
} catch (err) {
  res.status(500).json(err);
}
});

//GET all Bills
router.get("/user/:id", async(req,res)=>{

  try {
    const bill = await Bill.find({generatedBy:req.params.id});
    res.status(200).json(bill);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

module.exports = router;

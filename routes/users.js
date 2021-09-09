const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

//CREATE
router.post("/", async (req, res) => {

    const salt = await bcrypt.genSalt(11);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      role:req.body.role,
      password: hashedPass,
    });
    const user = await newUser.save();
    const { password, ...others } = user._doc;
    res.status(200).json(others);
});

//UPDATE
router.post("/useredit", async (req, res) => {
  
    if (req.body.userdata.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.userdata.password = await bcrypt.hash(req.body.userdata.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.body._id,
        {
          $set: req.body.userdata,
        },
        { new: true }
      );
      const { password, ...others } = updatedUser._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  
});

//DELETE
router.delete("/:id", async (req, res) => {
  
    try {
      const user = await User.findById(req.params.id);
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({"status":"success","message":"user deleted"});
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found!");
    }
  
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email});
    if(user){
      const validated = await bcrypt.compare(req.body.password, user.password);
      if(validated){
        const { password, ...others } = user._doc;
        res.status(200).json(others);
      }
      else{
        res.status(200).json({"errorMessage":"Password error, try again"});
      }
    }
    else{
      res.status(200).json({"errorMessage":"User not found"});
    }
  } catch (err) {
    res.status(500).json(err);
  }

})

//post user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

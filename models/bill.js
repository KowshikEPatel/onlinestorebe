const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    generatedBy:{
      type: mongoose.Types.ObjectId,
      required: true,
    },
    billRecipient:{
      type:String,
      require:true,
    },
    products:{
      type:[mongoose.Types.ObjectId],
      required: true,
    },
    productsqty:{
      type:[Number],
      required: true,
    },
    totalValue: {
      type:Number,
      required: true,
    },
    description:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("bills", BillSchema);

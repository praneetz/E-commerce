const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      uppercase:true
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

categorySchema.statics.getAllCategory=async()=>{
   const catList=await category.find({}).select(["-createdAt","-updatedAt"])
   return catList

}

const category=  mongoose.model("category", categorySchema);
module.exports=category

const auth=require("../models/auth")
exports.createUser=async(req,res)=>{
    try{
        console.log(req.body)
        const isExistingUserWithEmail=await auth.findOne({email:req.body.email});
        const isExistingUserWithMobile=await auth.findOne({mobile:req.body.mobile});
        if(isExistingUserWithEmail||isExistingUserWithMobile)
        return res.status(400).send(["Already existing user with given email and mobile number"]);
        const newAuth=new auth(req.body)
        const isCreated=await newAuth.save();
        if(!isCreated)
        return res.status(400).send(["Something went wrong!"])
        return res.status(200).send("Register Successfull!")

    }catch(err){
        console.log(err)
        return res.status(400).send(["Something went wrong!"])
    }
}
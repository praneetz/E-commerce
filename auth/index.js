exports.createUser=async(req,res)=>{
    try{
        console.log(req.body)
        res.redirect("/register")

    }catch(err){
        console.log(err)
    }
}
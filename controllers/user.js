const path=require('path')

exports.getHomePage=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views/index.html'))
}



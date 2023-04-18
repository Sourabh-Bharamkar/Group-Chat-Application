const path=require('path')

exports.getDashboard=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views/dashboard.html'))
}
const AWS=require('aws-sdk')
const dotenv=require('dotenv')
dotenv.config()

exports.uploadToS3=(file,filename)=>{
    let S3=new AWS.S3({
        accessKeyId:process.env.IAM_USER_ACCESS_KEY_ID,
        secretAccessKey:process.env.IAM_USER_SECRET_ACCESS_KEY
    })

    const params={
        Bucket:'expense-tracker-123',
        Key:filename,
        Body:file,
        ACL:'public-read'
    }

    return new Promise((resolve,reject)=>{
        S3.upload(params,(err,s3response)=>{
            if(err){
                console.log(err)
                reject(err);
            }
            else{
                console.log('success',s3response)
                resolve(s3response.Location)
            }
        })
    })

}
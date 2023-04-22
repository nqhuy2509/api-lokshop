var AWS = require('aws-sdk')
var multer = require('multer')


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESSKEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const uploadToS3 = async (fileContent, fileName) =>{
    const uploadParams = {
        Bucket: 'lok-shop',
        Key: fileName,
        Body: fileContent,
        ACL: 'public-read'
    }

    const s3Response = await s3.upload(uploadParams).promise()
    return s3Response.Location
}

module.exports = {
    uploadToS3,
    upload
}
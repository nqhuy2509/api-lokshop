var AWS = require('aws-sdk');
var multer = require('multer');

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESSKEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToS3 = (fileContent, fileName) =>
	new Promise((resolve, reject) => {
		const uploadParams = {
			Bucket: 'lok-shop',
			Key: fileName,
			Body: fileContent,
			ACL: 'public-read',
		};

		s3.upload(uploadParams)
			.promise()
			.then((response) => resolve(response.Location))
			.catch((error) => reject(error));
	});

const deleteS3 = (fileName) =>
	new Promise((resolve, reject) => {
		const deleteParams = {
			Bucket: 'lok-shop',
			Key: fileName,
		};

		s3.deleteObject(deleteParams)
			.promise()
			.then(resolve)
			.catch((error) => reject(error));
	});

module.exports = {
	uploadToS3,
	upload,
	deleteS3,
};

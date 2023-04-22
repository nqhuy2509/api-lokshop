
const {PrismaClient} = require('@prisma/client')
const { BadRequestExeption, SuccessResponse, BadGatewayExeption } = require('../utils/response')
const { uploadToS3 } = require('../middleware/upload')
const message = require('../constants/message')

const prisma = new PrismaClient

const addNewProduct = async (req,res)=>{
    const {name,description, price,categoryId} = req.body
    const image = req.file.buffer
    const imageName = req.file.originalname

    if(!name || !price || !categoryId){
        return BadRequestExeption(res, "Missing require parameter")
    }

    const existCategory = await prisma.productCategory.findUnique({where :{id: categoryId}})

    if(!existCategory){
        return BadRequestExeption(res, "Category is not found")
    }

    try {
        const s3Response = await uploadToS3(image,imageName)
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                image: s3Response,
                categoryId
            }
        })

        return SuccessResponse(res, message.product.CREATE_SUCCESS, newProduct)
    } catch (error) {
        console.log(error);
        return BadGatewayExeption(res, message.SOMETHING_WRONG, error)
    }
}

module.exports = {
    addNewProduct
}
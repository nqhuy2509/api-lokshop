const { PrismaClient } = require('@prisma/client');
const { BadRequestExeption, SuccessResponse, BadGatewayExeption } = require('../utils/response');
const { uploadToS3 } = require('../middleware/upload');
const message = require('../constants/message');
const { BAD_GATEWAY } = require('../constants/statusCode');

const prisma = new PrismaClient();

const addNewProduct = async (req, res) => {
	const { name, description, price, categoryId } = req.body;

	if (!name || !price || !categoryId) {
		return BadRequestExeption(res, 'Missing require parameter');
	}

	const existCategory = await prisma.productCategory.findUnique({ where: { id: categoryId } });

	if (!existCategory) {
		return BadRequestExeption(res, 'Category is not found');
	}

	try {
        let imageResource = null
            
        if(req.file){
            const image = req.file.buffer;
            const imageName = req.file.originalname;

            imageResource = await uploadToS3(image, imageName)
            
        }
		
		const newProduct = await prisma.product.create({
			data: {
				name,
				description,
				price,
				image: imageResource,
				categoryId,
			},
		});

		return SuccessResponse(res, message.product.CREATE_SUCCESS, newProduct);
	} catch (error) {
		console.log(error);
		return BadGatewayExeption(res, message.SOMETHING_WRONG, error);
	}
};

const getAllProduct = async (req, res) => {
	try {
		const products = await prisma.product.findMany({
			include: {
				category: {
					select: {
						name: true,
					},
				},
			},
		});
		return SuccessResponse(res, message.REQUEST_SUCCESS, products);
	} catch (error) {
		return BAD_GATEWAY(res, message.SOMETHING_WRONG, error);
	}
};

const getAllCategory = async (req, res) => {
	try {
		const categories = await prisma.productCategory.findMany({});
        return SuccessResponse(res,message.REQUEST_SUCCESS, categories)
	} catch (error) {
		return BAD_GATEWAY(res, message.SOMETHING_WRONG, error);
	}
};

module.exports = {
	addNewProduct,
	getAllProduct,
    getAllCategory
};

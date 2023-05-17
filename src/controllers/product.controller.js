const { PrismaClient } = require('@prisma/client');
const { BadRequestException, SuccessResponse, BadGatewayException, NotFoundException } = require('../utils/response');
const { uploadToS3, deleteS3 } = require('../middleware/upload');
const message = require('../constants/message');
const { BAD_GATEWAY } = require('../constants/statusCode');

const prisma = new PrismaClient();

const addNewProduct = async (req, res) => {
	const { name, description, price, categoryId } = req.body;

	if (!name || !price || !categoryId) {
		return BadRequestException(res, 'Missing require parameter');
	}

	const existCategory = await prisma.productCategory.findUnique({ where: { id: categoryId } });

	if (!existCategory) {
		return BadRequestException(res, 'Category is not found');
	}

	try {
		let imageResource = null;

		if (req.file) {
			const image = req.file.buffer;
			const imageName = req.file.originalname;

			imageResource = await uploadToS3(image, imageName);
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
		return BadGatewayException(res, error = error);
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
			orderBy: {
				createdAt: 'desc',
			},
		});
		return SuccessResponse(res, message.REQUEST_SUCCESS, products);
	} catch (error) {
		return BadGatewayException(res,error = error);
	}
};

const getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		const exist = await prisma.product.findUnique({ where: { id } });
		if (!exist) {
			return NotFoundException(res, message.product.NOT_FOUND);
		}
		return SuccessResponse(res, message.REQUEST_SUCCESS, exist);
	} catch (error) {
		return BadGatewayException(res, error = error);
	}
};

const updateProductById = async (req, res) => {
	const { id, name, categoryId, description, price } = req.body;

	if (!id) {
		return NotFoundException(res, message.product.NOT_FOUND);
	}

	const exist = await prisma.product.findUnique({ where: { id } });
	if (!exist) {
		return NotFoundException(res, message.product.NOT_FOUND);
	}

	if (name && name !== '') {
		exist.name = name;
	}
	if (categoryId) {
		exist.categoryId = categoryId;
	}
	if (description && description !== '') {
		exist.description = description;
	}
	if (price) {
		exist.price = price;
	}

	try {
		if (req.file) {
			const image = req.file.buffer;
			const imageName = req.file.originalname;

			const imageResource = await uploadToS3(image, imageName);

			if (exist.image) {
				await deleteS3(exist.image);
			}

			exist.image = imageResource;
		}

		const updated = await prisma.product.update({
			where: { id },
			data: exist,
		});
		return SuccessResponse(res, message.REQUEST_SUCCESS, updated);
	} catch (error) {
		return BadGatewayException(res,error =  error);
	}
};

const deleteProductById = async (req, res) => {
	try {
		const { id } = req.body;
		if (!id) {
			return BadRequestException(res, message.product.NOT_FOUND);
		}
		const exist = await prisma.product.findUnique({
			where: {
				id,
			},
		});

		if (!exist) {
			return BadRequestException(res, message.product.NOT_FOUND);
		}

		if (exist.image) {
			await deleteS3(exist.image);
		}

		const deleteProduct = await prisma.product.delete({where: {
			id
		}})

		return SuccessResponse(res, message.REQUEST_SUCCESS, deleteProduct);
	} catch (e) {
		return BadGatewayException(res,error = e)
	}
};

const getAllCategory = async (req, res) => {
	try {
		const categories = await prisma.productCategory.findMany({});
		return SuccessResponse(res, message.REQUEST_SUCCESS, categories);
	} catch (error) {
		return BadGatewayException(res,error = error);
	}
};

module.exports = {
	addNewProduct,
	getAllProduct,
	getAllCategory,
	getProductById,
	updateProductById,
    deleteProductById
};

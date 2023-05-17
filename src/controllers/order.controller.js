const { BadGatewayException, SuccessResponse, BadRequestException } = require('../utils/response');
const { PrismaClient } = require('@prisma/client');
const message = require('../constants/message');

const prisma = new PrismaClient();

const getAllOrder = async (req, res) => {
	try {
		const orders = await prisma.order.findMany({
			include: {
				products: {
					include: {
						product: {
							select: {
								name: true,
								price: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return SuccessResponse(res, message.REQUEST_SUCCESS, orders);
	} catch (error) {
		return BadGatewayException(res, (error = error));
	}
};

const createNewOrder = async (req, res) => {
	try {
		const { firstName, lastName, phoneNumber, address, ward, district, province, products } = req.body;

		if (!firstName || !lastName || !phoneNumber || !address || !ward || !district || !province) {
			return BadRequestException(res, message.order.MISSING_PARAMS);
		}

		const newOrder = await prisma.order.create({
			data: {
				firstName,
				lastName,
				phoneNumber,
				address,
				ward,
				district,
				province,
				products: {
					create: products.map((p) => ({
						quantity: p.quantity,
						product: {
							connect: {
								id: p.productId,
							},
						},
					})),
				},
			},
			include: {
				products: {
					include: {
						product: {
							select: {
								name: true,
								price: true,
							},
						},
					},
				},
			},
		});

		return SuccessResponse(res, message.order.CREATE_SUCCESS, newOrder);
	} catch (error) {
		return BadGatewayException(res, (error = error.message));
	}
};

const getOrderById = async (req, res) => {
	const { id } = req.params;
	try {
		const existOrder = await prisma.order.findUnique({
			where: { id },
			include: { products: { include: { product: { select: { name: true, price: true } } } } },
		});

		if (!existOrder) {
			return BadRequestException(res, 'Order is not found!');
		}

		return SuccessResponse(res, message.REQUEST_SUCCESS, existOrder);
	} catch (error) {
		return BadGatewayException(res, (error = error.message));
	}
};

module.exports = {
	getAllOrder,
	createNewOrder,
	getOrderById
};

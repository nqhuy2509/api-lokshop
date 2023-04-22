var jwt = require('jsonwebtoken');
var { AuthorizationExeption } = require('../utils/response');

module.exports = async (req, res, next) => {
	if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
		return AuthorizationExeption(res, null);
	}

	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return AuthorizationExeption(res, null);
	}

	try {
		const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

		req.user = decoded.sub

		next();
	} catch (error) {
		return AuthorizationExeption(res, null);
	}
};

var jwt = require('jsonwebtoken');
var { AuthorizationException } = require('../utils/response');

module.exports = async (req, res, next) => {
	if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
		return AuthorizationException(res, null);
	}

	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return AuthorizationException(res, null);
	}

	try {
		const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

		req.user = decoded.sub

		next();
	} catch (error) {
		return AuthorizationException(res, null);
	}
};

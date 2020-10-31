const jwt = require('jsonwebtoken');

const department = ['user', 'admin'];

function restrict() {
	return (req, res, next) => {
		const token = req.headers.token;

		if (!token) {
			return res.status(401).json({ message: 'Invalid token.' });
		}

		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).json({ message: 'Invalid token.' });
			} else {
				req.jwt === decoded;
				next();
			}
		});
	};
}

module.exports = {
	restrict,
};

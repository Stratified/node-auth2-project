const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('./users-model');
const { restrict } = require('./users-middleware');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/users', restrict('user'), async (req, res, next) => {
	try {
		res.json(await Users.find());
	} catch (err) {
		next(err);
	}
});

router.post('/register', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findByUsername(username);

		if (user) {
			return res.status(409).json({
				message: 'Username is already taken',
			});
		}

		const newUser = await Users.add({
			username,
			password: await bcrypt.hash(password, 14),
			department: req.body.department,
		});

		res.status(201).json(newUser);
	} catch (err) {
		next(err);
	}
});

router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findByUsername(username);

		if (!user) {
			return res.status(401).json({
				message: 'You shall not pass!',
			});
		}

		const passwordValid = await bcrypt.compare(password, user.password);

		if (!passwordValid) {
			return res.status(401).json({
				message: 'You shall not pass!',
			});
		}

		// req.session.user = user

		const token = jwt.sign(
			{
				userID: user.id,
			},
			process.env.JWT_SECRET
		);

		res.json({
			message: `Welcome ${user.username}!`,
			token: token,
		});
	} catch (err) {
		next(err);
	}
});

router.get('/logout', async (req, res, next) => {
	try {
		req.session.destroy((err) => {
			if (err) {
				next(err);
			} else {
				res.status(204).end();
			}
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;

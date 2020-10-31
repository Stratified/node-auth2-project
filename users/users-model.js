const db = require('../config');

async function add(user) {
	const [id] = await db('users').insert(user);
	return findById(id);
}

function find() {
	return db('users as u').select('u.id', 'u.username');
}

function findById(id) {
	return db('users').where({ id }).first();
}

function findByUsername(username) {
	return db('users as u')
		.where('u.username', username)
		.first('u.id', 'u.username', 'u.password');
}

module.exports = {
	add,
	find,
	findByUsername,
};

const server = require('../api/server.js');
const request = require('supertest');
const db = require('../database/db-config.js');

describe('auth-router', function() {
	beforeEach(async function() {
		await db('users').truncate();
		return request(server)
			.post('/api/auth/signup')
			.send({
				email: 'seedemail',
				password: 'seedpassword'
			});
	});

	describe('test environment', function() {
		it('should be using test env', function() {
			expect(process.env.DB_ENV).toBe('testing');
		});
	});

	describe('api/auth/signup', function() {
		it('register', function() {
			return request(server)
				.post('/api/auth/signup')
				.send({
					email: 'testemail',
					password: 'testpassword'
				})
				.expect(201);
		});

		it('is a json object', function() {
			return request(server)
				.post('/api/auth/signup')
				.send({ email: 'testemail3', password: 'testpassword' })
				.then(res => {
					expect(res.body.email).toBe('testemail3');
				});
		});
	});

	describe('api/auth/login', function() {
		it('login', function() {
			return request(server)
				.post('/api/auth/login')
				.send({
					email: 'seedemail',
					password: 'seedpassword'
				})
				.expect(200);
		});

		it('is a json object', function() {
			return request(server)
				.post('/api/auth/login')
				.send({ email: 'seedemail', password: 'seedpassword' })
				.then(res => {
					expect(res.body.email).toBe('seedemail');
				});
		});

		it('expect user', function() {
			return request(server)
				.post('/api/auth/login')
				.send({ email: 'failseedemail', password: 'failseedpassword' })
				.then(res => {
					expect(res.body.message).toBe('No user found in DB');
				});
		});
	});
});

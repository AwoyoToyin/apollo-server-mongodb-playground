import expect from 'expect'
import {
	connectDb, disconnectDb,
} from '../../helpers'
import Admin from '../../../src/api/resources/admin/admin.connector'

const data = {
	name: 'My Admin',
	email: 'my_admin@gmail.com',
	role: 'administrator',
}

/* eslint-disable no-undef */
describe('Admin Connector', () => {
	before(async () => {
		connectDb()
	})

	it('should throw a BadRequest error when no password is supplied during signup', (done) => {
		const instance = new Admin()
		instance.signup(data)
			.catch((error) => {
				expect(error.name).toBe('BadRequest')
				done()
			})
	})

	it('should sign a new admin up', (done) => {
		data.password = 'admin@password'

		const instance = new Admin()
		instance.signup(data)
			.then((admin) => {
				expect(admin.name).toBe(data.name)
				expect(admin.email).toBe(data.email)
				expect(admin.role).toBe(data.role)
				done()
			})
	})

	it('should throw validation error for duplicate entry', (done) => {
		data.password = 'admin@password'

		const instance = new Admin()
		instance.signup(data)
			.catch((error) => {
				expect(error.name).toBe('EmailOrPhoneExists')
				done()
			})
	})

	it('should fail to log a admin in when no email/password is supplied', (done) => {
		const instance = new Admin()
		instance.login('', '')
			.catch((error) => {
				expect(error.name).toBe('WrongCredentials')
				done()
			})
	})

	it('should fail to log a admin in with an invalid email', (done) => {
		const instance = new Admin()
		instance.login('myadmin@gmail.com', data.password)
			.catch((error) => {
				expect(error.name).toBe('WrongCredentials')
				done()
			})
	})

	it('should fail to log a admin in with an invalid password', (done) => {
		const instance = new Admin()
		instance.login(data.email, 'passwor')
			.catch((error) => {
				expect(error.name).toBe('WrongCredentials')
				done()
			})
	})

	it('should log a admin in', (done) => {
		const instance = new Admin()
		instance.login(data.email, data.password)
			.then((admin) => {
				expect(admin.email).toBe(data.email)
				expect(admin.password).toBeUndefined()
				expect(admin.token.length).toBeGreaterThan(10)
				done()
			})
	})

	after(async () => {
		await disconnectDb()
	})
})

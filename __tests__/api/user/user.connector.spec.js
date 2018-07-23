import expect from 'expect'
import {
	connectDb, disconnectDb,
} from '../../helpers'
import User from '../../../src/api/resources/user/user.connector'
import Field from '../../../src/api/resources/field/field.connector'
import { seedFields } from '../../../src/utils'

const data = {
	name: 'Busola',
	email: 'buso@gmail.com',
	phone: '090876545678',
	field: '',
}

/* eslint-disable no-undef */
describe('User Connector', () => {
	before(async () => {
		connectDb()
	})

	it('should create a list of fields', (done) => {
		seedFields()
			.then((result) => {
				expect(result).toContain('Documents created')
				const instance = new Field()
				return instance.findOne({ name: 'Football Field 1' })
			})
			.then((field) => {
				data.field = field._id
				expect(field.name).toBe('Football Field 1')
				done()
			})
	})

	it('should throw a BadRequest error when no password is supplied during signup', (done) => {
		const instance = new User()
		instance.signup(data)
			.catch((error) => {
				expect(error.name).toBe('BadRequest')
				done()
			})
	})

	it('should sign a new user up', (done) => {
		data.password = 'password'

		const instance = new User()
		instance.signup(data)
			.then((user) => {
				expect(user.name).toBe(data.name)
				expect(user.email).toBe(data.email)
				expect(user.phone).toBe(data.phone)
				done()
			})
	})

	it('should throw validation error for duplicate entry', (done) => {
		data.password = 'password'

		const instance = new User()
		instance.signup(data)
			.catch((error) => {
				expect(error.name).toBe('EmailOrPhoneExists')
				done()
			})
	})

	it('should fail to log a user in when no email/password is supplied', (done) => {
		const instance = new User()
		instance.login('', '')
			.catch((error) => {
				expect(error.name).toBe('WrongCredentials')
				done()
			})
	})

	it('should fail to log a user in with an invalid email', (done) => {
		const instance = new User()
		instance.login('busola@gmail.com', data.password)
			.catch((error) => {
				expect(error.name).toBe('WrongCredentials')
				done()
			})
	})

	it('should fail to log a user in with an invalid password', (done) => {
		const instance = new User()
		instance.login(data.email, 'passwor')
			.catch((error) => {
				expect(error.name).toBe('WrongCredentials')
				done()
			})
	})

	it('should log a user in', (done) => {
		const instance = new User()
		instance.login(data.email, data.password)
			.then((user) => {
				expect(user.email).toBe(data.email)
				expect(user.password).toBeUndefined()
				expect(user.token.length).toBeGreaterThan(10)
				done()
			})
	})

	after(async () => {
		await disconnectDb()
	})
})

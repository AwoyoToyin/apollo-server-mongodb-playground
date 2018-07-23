import expect from 'expect'
import {
	connectDb, disconnectDb,
} from '../../../helpers'
import User from '../../../../src/api/resources/user/user.connector'
import Field from '../../../../src/api/resources/field/field.connector'
import { seedFields } from '../../../../src/utils'

const data = {
	name: 'Busola',
	email: 'buso@gmail.com',
	phone: '090876545678',
	password: 'password',
	field: '',
}

/* eslint-disable no-undef */
describe('Abstract Connector', () => {
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

	it('should create a new entity for the given model', (done) => {
		const instance = new User()
		instance.create(data)
			.then((user) => {
				expect(user.name).toBe(data.name)
				expect(user.email).toBe(data.email)
				expect(user.phone).toBe(data.phone)
				done()
			})
	})

	it('should fail validation when given existing values for unique fields in the given model', (done) => {
		const instance = new User()
		instance.create(data)
			.catch((error) => {
				expect(error.name).toBe('BadRequest')
				done()
			})
	})

	it('should return an entity for the given model', (done) => {
		const instance = new User()
		instance.findOne({ email: data.email })
			.then((user) => {
				expect(user.email).toBe(data.email)
				done()
			})
	})

	it('should fail to return an entity for the given model', (done) => {
		const instance = new User()
		instance.findOne({ email: 'busobuso@gmail.com' })
			.catch((error) => {
				expect(error.name).toBe('NotFound')
				done()
			})
	})

	it('should return all records for the given model', (done) => {
		const instance = new User()
		instance.find()
			.then((users) => {
				const { docs } = users
				expect(docs.length).toBe(1)
				expect(docs[0].email).toBe(data.email)
				done()
			})
	})

	it('should update an entity for the given model', (done) => {
		const update = {
			email: 'busola@gmail.com',
		}
		const instance = new User()
		instance.update({ email: data.email }, update)
			.then((user) => {
				expect(user.email).toBe(update.email)
				done()
			})
	})

	it('should fail to update an entity for the given model', (done) => {
		const update = {
			email: 'busayo@gmail.com',
		}
		const instance = new User()
		instance.update({ email: data.email }, update)
			.catch((error) => {
				expect(error.name).toBe('NotFound')
				done()
			})
	})

	it('should fail to delete when no matching criteria for the given model', (done) => {
		const instance = new Field()
		instance.delete({ name: 'Football Field 22' })
			.then((field) => {
				expect(field).toBeNull()
				done()
			})
	})

	it('should delete matching criteria for the given model', (done) => {
		const instance = new Field()
		instance.delete({ name: 'Football Field 19' })
			.then((field) => {
				expect(field.name).toBe('Football Field 19')
				done()
			})
	})

	after(async () => {
		await disconnectDb()
	})
})

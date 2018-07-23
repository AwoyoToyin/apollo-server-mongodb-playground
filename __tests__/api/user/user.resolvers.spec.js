import expect from 'expect'
import {
	connectDb, disconnectDb, runQuery,
} from '../../helpers'
import Field from '../../../src/api/resources/field/field.connector'
import { seedFields } from '../../../src/utils'

const variables = {
	input: {
		name: 'Shola Alison',
		email: 'sho@gmail.com',
		phone: '090876545678',
		password: 'password',
		field: '',
	},
}

let currentUser = {}

/* eslint-disable no-undef */
describe('User Resolvers', () => {
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
				variables.input.field = field._id
				expect(field.name).toBe('Football Field 1')
				done()
			})
	})

	/** Sign Up */
	it('should sign a new user up', (done) => {
		const query = `
            mutation($input: CreateUserInput!) {
                signup(input: $input) {
                    _id
					email
					reference
                    token
                }
            }
        `
		runQuery(query, variables)
			.then((result) => {
				const { data: { signup } } = result
				currentUser = signup
				expect(signup.token.length).toBeGreaterThan(10)
				expect(signup.email).toBe(variables.input.email)
				done()
			})
	})

	it('should sign another new user up', (done) => {
		const query = `
            mutation($input: CreateUserInput!) {
                signup(input: $input) {
                    _id
                    email
                    token
                }
            }
        `
		variables.input.email = 'user2@gmail.com'
		variables.input.phone = '08076839865'
		variables.input.name = 'Second User'
		runQuery(query, variables)
			.then((result) => {
				const { data: { signup } } = result
				expect(signup.token.length).toBeGreaterThan(10)
				expect(signup.email).toBe(variables.input.email)
				done()
			})
	})

	it('should throw validation error for duplicate entry', (done) => {
		const query = `
            mutation($input: CreateUserInput!) {
                signup(input: $input) {
                    _id
                    email
                    token
                }
            }
        `
		runQuery(query, variables)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	/** Update */
	it('should update a user', (done) => {
		const query = `
            mutation($input: UpdateUserInput!) {
                updateUser(input: $input) {
                    _id
                    email
                    name
                }
            }
        `
		delete variables.input.password
		delete variables.input.field
		variables.input._id = currentUser._id
		variables.input.name = 'Some User'
		variables.input.email = 'someuser@gmail.com'
		runQuery(query, variables)
			.then((result) => {
				const { data: { updateUser } } = result
				expect(updateUser.name).toBe(variables.input.name)
				expect(updateUser.email).toBe(variables.input.email)
				done()
			})
	})

	it('should fail to update a user when no _id is supplied', (done) => {
		const query = `
            mutation($input: UpdateUserInput!) {
                updateUser(input: $input) {
                    _id
                    email
                }
            }
        `
		delete variables.input.password
		delete variables.input.field
		delete variables.input._id
		variables.input.name = 'Some User'
		variables.input.email = 'user2@gmail.com'
		runQuery(query, variables)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	/** Confirm */
	it('should confirm a user account', (done) => {
		const query = `
            mutation {
                cofirmEmail(reference: "${currentUser.reference}") {
                    _id
                    email
                }
            }
        `
		runQuery(query)
			.then((result) => {
				const { data: { cofirmEmail } } = result
				expect(cofirmEmail.email).toBe('someuser@gmail.com')
				done()
			})
	})

	/** Login */
	it('should fail to log a user in with an invalid email', (done) => {
		const query = `
            mutation {
                login(email: "shola@gmail.com", password: "password") {
                    _id
                    email
                    token
                }
            }
        `
		runQuery(query, variables)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fail to log a user in with an invalid password', (done) => {
		const data = variables.input

		const query = `
            mutation {
                login(email: "${data.email}", password: "fakepassword") {
                    _id
                    email
                    token
                }
            }
        `
		runQuery(query, variables)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should log a user in', (done) => {
		const data = variables.input

		const query = `
            mutation {
                login(email: "${data.email}", password: "password") {
                    _id
                    email
                    token
                }
            }
        `
		runQuery(query, variables)
			.then((result) => {
				const { data: { login } } = result
				expect(login.email).toBe(data.email)
				expect(login.password).toBeUndefined()
				expect(login.token.length).toBeGreaterThan(10)
				done()
			})
	})

	/** Fetch */
	it('should fail to fetch a user when not logged in as admin', (done) => {
		const query = `
            query {
                user(_id: "${currentUser._id}") {
                    _id
                    email
                }
            }
        `
		runQuery(query, {}, { isAdmin: false })
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fail to fetch with invalid _id', (done) => {
		const query = `
            query {
                user(_id: "${currentUser._id}5756u") {
                    _id
                    email
                }
            }
        `
		runQuery(query)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fetch a user', (done) => {
		const query = `
            query {
                user(_id: "${currentUser._id}") {
                    _id
                    email
                }
            }
        `
		runQuery(query, {}, { isAdmin: true })
			.then((result) => {
				const { data: { user } } = result
				expect(user.email).toBe('someuser@gmail.com')
				done()
			})
	})

	it('should fail to fetch all users when not logged in as admin', (done) => {
		const query = `
            query {
                users {
                    _id
                    email
                }
            }
        `
		runQuery(query, {}, { isAdmin: false })
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fetch all users', (done) => {
		const query = `
            query {
                users {
                    docs {
						_id
						email
					}
					page
                }
            }
        `
		runQuery(query, {}, { isAdmin: true })
			.then((result) => {
				const { data: { users } } = result
				const { docs, page } = users
				expect(page).toEqual(1)
				expect(docs.length).toEqual(2)
				expect(docs[0].email).toBe('someuser@gmail.com')
				expect(docs[1].email).toBe('user2@gmail.com')
				done()
			})
	})

	it('should fail to fetch all verified users when not logged in as admin', (done) => {
		const query = `
            query {
                verifiedUsers {
                    docs {
						_id
						email
					}
                }
            }
        `
		runQuery(query, {}, { isAdmin: false })
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fetch all verified users', (done) => {
		const query = `
            query {
                verifiedUsers {
                    docs {
						_id
						email
					}
					page
                }
            }
        `
		runQuery(query, {}, { isAdmin: true })
			.then((result) => {
				const { data: { verifiedUsers } } = result
				const { docs, page } = verifiedUsers
				expect(page).toEqual(1)
				expect(docs.length).toEqual(1)
				done()
			})
	})

	after(async () => {
		await disconnectDb()
	})
})

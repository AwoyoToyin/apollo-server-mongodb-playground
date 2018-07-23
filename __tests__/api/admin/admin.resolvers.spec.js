import expect from 'expect'
import {
	connectDb, disconnectDb, runQuery,
} from '../../helpers'

const variables = {
	input: {
		name: 'Some Admin',
		email: 'mineadmin@gmail.com',
		password: 'password',
		role: 'supervisor',
	},
}

let currentAdmin = {}

/* eslint-disable no-undef */
describe('Admin Resolvers', () => {
	before(async () => {
		connectDb()
	})

	/** Sign Up */
	it('should sign a new admin up', (done) => {
		const query = `
            mutation($input: CreateAdminInput!) {
                addAdmin(input: $input) {
                    _id
                    email
                    token
                }
            }
        `
		runQuery(query, variables)
			.then((result) => {
				const { data: { addAdmin } } = result
				currentAdmin = addAdmin
				expect(addAdmin.token.length).toBeGreaterThan(10)
				expect(addAdmin.email).toBe(variables.input.email)
				done()
			})
	})

	it('should sign another admin up', (done) => {
		const query = `
            mutation($input: CreateAdminInput!) {
                addAdmin(input: $input) {
                    _id
					email
                    token
                }
            }
        `
		variables.input.email = 'admin2@gmail.com'
		variables.input.role = 'administrator'
		variables.input.name = 'Second Admin'
		runQuery(query, variables)
			.then((result) => {
				const { data: { addAdmin } } = result
				expect(addAdmin.token.length).toBeGreaterThan(10)
				expect(addAdmin.email).toBe(variables.input.email)
				done()
			})
	})

	it('should throw validation error for duplicate entry', (done) => {
		const query = `
            mutation($input: CreateAdminInput!) {
                addAdmin(input: $input) {
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
	it('should fail to update an admin when not logged in as an admin', (done) => {
		const query = `
            mutation($input: UpdateAdminInput!) {
                updateAdmin(input: $input) {
                    _id
                    email
                    name
                    role
                    updatedAt
                }
            }
        `
		delete variables.input.password
		variables.input._id = currentAdmin._id
		variables.input.name = 'Some Admin Edited'
		variables.input.email = 'someadmin@gmail.com'
		runQuery(query, variables)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should update an admin', (done) => {
		const query = `
            mutation($input: UpdateAdminInput!) {
                updateAdmin(input: $input) {
                    _id
                    email
                    name
                    role
                    updatedAt
                }
            }
        `
		runQuery(query, variables, { isAdmin: true })
			.then((result) => {
				const { data: { updateAdmin } } = result
				expect(updateAdmin.name).toBe(variables.input.name)
				expect(updateAdmin.email).toBe(variables.input.email)
				done()
			})
	})

	it('should fail to update a admin when no _id is supplied', (done) => {
		const query = `
            mutation($input: UpdateAdminInput!) {
                updateAdmin(input: $input) {
                    _id
                    email
                    name
                    verified
                    updatedAt
                }
            }
        `
		delete variables.input.password
		delete variables.input._id
		variables.input.name = 'Some Admin Edited'
		variables.input.email = 'admin2@gmail.com'
		runQuery(query, variables)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	/** Login */
	it('should fail to log an admin in with an invalid email', (done) => {
		const query = `
            mutation {
                adminLogin(email: "shola@gmail.com", password: "${variables.input.password}") {
                    _id
                    email
                    token
                }
            }
        `
		runQuery(query)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fail to log an admin in with an invalid password', (done) => {
		const query = `
            mutation {
                adminLogin(email: "${variables.input.email}", password: "fakepassword") {
                    _id
                    email
                    token
                }
            }
        `
		runQuery(query)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should log an admin in', (done) => {
		const data = variables.input

		const query = `
            mutation {
                adminLogin(email: "${data.email}", password: "password") {
                    _id
                    email
                    token
                }
            }
        `
		runQuery(query)
			.then((result) => {
				const { data: { adminLogin } } = result
				expect(adminLogin.email).toBe(data.email)
				expect(adminLogin.password).toBeUndefined()
				expect(adminLogin.token.length).toBeGreaterThan(10)
				done()
			})
	})

	/** Fetch */
	it('should fail to fetch all admins when not logged in as admin', (done) => {
		const query = `
            query {
                docs {
					_id
					email
				}
				page
            }
        `
		runQuery(query)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fetch all admins', (done) => {
		const query = `
            query {
                allAdmin {
                    docs {
						_id
						email
						name
						role
					}
					page
                }
            }
        `
		runQuery(query, {}, { isAdmin: true })
			.then((result) => {
				const { data: { allAdmin } } = result
				const { docs, page } = allAdmin
				expect(page).toEqual(1)
				expect(docs.length).toEqual(2)
				expect(docs[0].email).toBe('someadmin@gmail.com')
				expect(docs[1].email).toBe('admin2@gmail.com')
				done()
			})
	})

	after(async () => {
		await disconnectDb()
	})
})

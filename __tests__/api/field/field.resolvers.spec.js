import expect from 'expect'
import {
	connectDb, disconnectDb, runQuery,
} from '../../helpers'
import Field from '../../../src/api/resources/field/field.connector'
import { seedFields } from '../../../src/utils'

const variables = {
	input: {
		name: 'Some Football Field',
		coordinates: ['', ''],
	},
}

let currentField = {}

/* eslint-disable no-undef */
describe('Field Resolvers', () => {
	before(async () => {
		connectDb()
	})

	it('should create a list of fields', (done) => {
		seedFields()
			.then((result) => {
				expect(result).toContain('Documents created')
				const instance = new Field()
				return instance.findOne({ name: 'Football Field 4' })
			})
			.then((field) => {
				expect(field.name).toBe('Football Field 4')
				done()
			})
	})

	/** Fetch */
	it('should fetch all fields', (done) => {
		const query = `
            query {
                fields {
                    docs {
						_id
						name
					}
					page
                }
            }
        `
		runQuery(query)
			.then((result) => {
				const { data: { fields } } = result
				const { docs, page } = fields
				expect(page).toBe(1)
				expect(docs.length).toBe(10)
				expect(docs[0].name).toBe('Football Field 0')
				expect(docs[9].name).toBe('Football Field 9')
				done()
			})
	})

	/** Create a new field */
	it('should create a new field', (done) => {
		const query = `
	        mutation($input: CreateFieldInput!) {
	            createField(input: $input) {
                    _id
					name
	            }
	        }
		`
		runQuery(query, variables, { isAdmin: true })
			.then((result) => {
				const { data: { createField } } = result
				currentField = createField
				expect(createField.name).toBe(variables.input.name)
				done()
			})
	})

	it('should fail to create a new field when not logged in as admin', (done) => {
		const query = `
	        mutation($input: CreateFieldInput!) {
	            createField(input: $input) {
                    _id
					name
	            }
	        }
		`
		runQuery(query, variables, { isAdmin: false })
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fail to create a new field when either name or coordinates isn\'t supplied', (done) => {
		const query = `
	        mutation($input: CreateFieldInput!) {
	            createField(input: $input) {
                    _id
					name
	            }
	        }
		`
		delete variables.input.name
		runQuery(query, variables)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	/** Fetch Single */
	it('should fail to fetch with an invalid _id', (done) => {
		const query = `
	        query {
	            field(_id: "${currentField._id}5756u") {
	                _id
	                name
	            }
	        }
	    `
		runQuery(query)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fetch a field', (done) => {
		const query = `
	        query {
	            field(_id: "${currentField._id}") {
	                _id
	                name
	            }
	        }
	    `
		runQuery(query)
			.then((result) => {
				const { data: { field } } = result
				expect(field.name).toBe('Some Football Field')
				done()
			})
	})

	/** Update */
	it('should fail to update a field when not logged in as admin', (done) => {
		const query = `
	        mutation($input: UpdateFieldInput!) {
	            updateField(input: $input) {
	                _id
	                name
	            }
	        }
	    `
		variables.input._id = currentField._id
		variables.input.name = 'Akoka Football Pitch'
		runQuery(query, variables, { isAdmin: false })
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should update a field', (done) => {
		const query = `
	        mutation($input: UpdateFieldInput!) {
	            updateField(input: $input) {
	                _id
	                name
	            }
	        }
	    `
		runQuery(query, variables, { isAdmin: true })
			.then((result) => {
				const { data: { updateField } } = result
				expect(updateField.name).toBe(variables.input.name)
				done()
			})
	})

	it('should fail to trash / soft delete a field when not logged in as admin', (done) => {
		const query = `
	        mutation {
	            trashField(_id: "${currentField._id}") {
	                _id
	                name
	            }
	        }
	    `
		runQuery(query, variables, { isAdmin: false })
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should trash / soft delete a field', (done) => {
		const query = `
	        mutation {
	            trashField(_id: "${currentField._id}") {
	                _id
	                name
	                trashed
	            }
	        }
	    `
		runQuery(query, variables, { isAdmin: true })
			.then((result) => {
				const { data: { trashField } } = result
				expect(trashField.name).toBe(variables.input.name)
				expect(trashField.trashed).toBeTruthy()
				done()
			})
	})

	it('should fail to update a field when no _id is supplied', (done) => {
		const query = `
	        mutation($input: UpdateFieldInput!) {
	            updateField(input: $input) {
	                _id
	                name
	            }
	        }
	    `
		delete variables.input._id
		variables.input.name = 'Akoka Football Pitch !Update'
		runQuery(query, variables)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fail to trash / soft delete a field with a wrong _id supplied', (done) => {
		const query = `
	        mutation {
	            trashField(_id: "${currentField._id}8962") {
	                _id
	                name
	            }
	        }
	    `
		runQuery(query, variables)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fail to fetch all trashed fields when not logged in as admin', (done) => {
		const query = `
            query {
                trashedFields {
                    docs {
						_id
						name
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

	it('should fetch all trashed fields', (done) => {
		const query = `
            query {
                trashedFields {
                    docs {
						_id
						name
					}
					page
                }
            }
        `
		runQuery(query, {}, { isAdmin: true })
			.then((result) => {
				const { data: { trashedFields } } = result
				const { docs, page } = trashedFields
				expect(page).toBe(1)
				expect(docs.length).toBe(1)
				expect(docs[0].name).toBe('Akoka Football Pitch')
				done()
			})
	})

	/** Delete */
	it('should fail to delete a field when not logged in as admin', (done) => {
		const query = `
	        mutation {
	            deleteField(_id: "${currentField._id}") {
	                _id
	                name
	            }
	        }
	    `
		runQuery(query, {}, { isAdmin: false })
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should fail to delete a field with a wrong _id supplied', (done) => {
		const query = `
	        mutation {
	            deleteField(_id: "${currentField._id}7832") {
	                _id
	                name
	            }
	        }
	    `
		runQuery(query)
			.then((result) => {
				expect(result.errors.length).toBeGreaterThan(0)
				done()
			})
	})

	it('should delete a field', (done) => {
		const query = `
	        mutation {
	            deleteField(_id: "${currentField._id}") {
	                _id
	                name
	                trashed
	            }
	        }
	    `
		runQuery(query, {}, { isAdmin: true })
			.then((result) => {
				const { data: { deleteField } } = result
				expect(deleteField._id).toBe(currentField._id)
				expect(deleteField.trashed).toBeTruthy()
				done()
			})
	})

	after(async () => {
		await disconnectDb()
	})
})

import { PubSub, withFilter } from 'apollo-server'

import { helmet } from '../../../utils'
import { Forbidden } from '../../responses'
import User from '../user/user.connector'
import Field from './field.connector'

const pubsub = new PubSub()

const fieldResolvers = {
	Query: {
		fields: helmet(async (_, args) => {
			/** Instantiate the field connector */
			const instance = new Field()
			/** Find and return all fields excluding the trashed ones */
			const fields = await instance.find({ trashed: false }, args)
			/** Return the result */
			return fields
		}),
		trashedFields: helmet(async (_, args, context) => {
			/** Admin access only */
			if (!context.isAdmin) {
				throw new Forbidden()
			}

			/** Instantiate the field connector */
			const instance = new Field()
			/** Find and return all trashed fields */
			const fields = await instance.find({ trashed: true }, args)
			/** Return the result */
			return fields
		}),
		field: helmet(async (_, { _id }) => {
			try {
				/** Instantiate the field connector */
				const instance = new Field()
				/** Find the field */
				const field = await instance.findOne({ _id })
				/** Return the result */
				return field
			} catch (error) {
				throw error
			}
		}),
	},
	Mutation: {
		createField: helmet(async (_, { input }, context) => {
			try {
				/** Admin access only */
				if (!context.isAdmin) {
					throw new Forbidden()
				}

				/** Instantiate the field connector */
				const instance = new Field()
				/** Create the field */
				const field = await instance.create(input)

				/** Publish the created field to any subscriber */
				pubsub.publish('fieldCreated', { fieldCreated: field, event: 'fieldCreated' })

				/** Return the result */
				return field
			} catch (err) {
				throw err
			}
		}),
		updateField: helmet(async (_, { input }, context) => {
			try {
				/** Admin access only */
				if (!context.isAdmin) {
					throw new Forbidden()
				}

				/** Instantiate the field connector */
				const instance = new Field()
				/** Update the field attributes */
				const field = await instance.update({ _id: input._id }, input)
				/** Return the result */
				return field
			} catch (err) {
				throw err
			}
		}),
		/** Handles Soft Delete */
		trashField: helmet(async (_, { _id }, context) => {
			try {
				/** Admin access only */
				if (!context.isAdmin) {
					throw new Forbidden()
				}

				/** Instantiate the field connector */
				const instance = new Field()
				/** Trash the field */
				const field = await instance.update({ _id }, { trashed: true })

				/** Publish the created field to any subscriber */
				pubsub.publish('fieldTrashed', { fieldTrashed: field, event: 'fieldTrashed' })
				/** Return the result */
				return field
			} catch (err) {
				throw err
			}
		}),
		/** Handles Hard Delete */
		deleteField: helmet(async (_, { _id }, context) => {
			try {
				/** Admin access only */
				if (!context.isAdmin) {
					throw new Forbidden()
				}

				/** Instantiate the field connector */
				const instance = new Field()
				/** Create the field */
				const field = await instance.delete({ _id })

				/** Publish the created field to any subscriber */
				pubsub.publish('fieldDeleted', { fieldDeleted: field, event: 'fieldDeleted' })
				/** Return the result */
				return field
			} catch (err) {
				throw err
			}
		}),
	},
	Subscription: {
		fieldCreated: {
			subscribe: withFilter(
				() => pubsub.asyncIterator('fieldCreated'),
				(payload, variables) => payload.event === variables.event,
			),
		},
		fieldUpdated: {
			subscribe: withFilter(
				() => pubsub.asyncIterator('fieldUpdated'),
				(payload, variables) => payload.event === variables.event,
			),
		},
		fieldDeleted: {
			subscribe: withFilter(
				() => pubsub.asyncIterator('fieldDeleted'),
				(payload, variables) => payload.event === variables.event,
			),
		},
	},
	FieldOutput: {
		// Fetch the number of votes if requested by the client
		votes: async (parent) => {
			try {
				/** Instantiate the user connector */
				const instance = new User()
				/** Find and count all users that selected the field during registration */
				const votes = await instance.count({ field: parent._id })
				/** Return the count result */
				return votes
			} catch (err) {
				throw err
			}
		},
	},
}

export default fieldResolvers

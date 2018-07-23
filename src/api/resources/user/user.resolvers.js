import { PubSub, withFilter } from 'apollo-server'

import { helmet } from '../../../utils'
import { Forbidden } from '../../responses'
import Field from '../field/field.connector'
import User from './user.connector'
import { EmailService } from '../shared/services'

const pubsub = new PubSub()

const userResolvers = {
	Query: {
		user: helmet(async (_, { _id }, context) => {
			try {
				/** Admin access only */
				if (!context.isAdmin) {
					throw new Forbidden()
				}

				/** Instantiate the user connector */
				const instance = new User()
				/** Find the user */
				const user = await instance.findOne({ _id })
				/** Return the result */
				return user
			} catch (error) {
				throw error
			}
		}),
		users: helmet(async (_, __, context) => {
			/** Admin access only */
			if (!context.isAdmin) {
				throw new Forbidden()
			}

			/** Instantiate the user connector */
			const instance = new User()
			/** Find all users */
			const users = await instance.find()
			/** Return the result */
			return users
		}),
		verifiedUsers: helmet(async (_, __, context) => {
			/** Admin access only */
			if (!context.isAdmin) {
				throw new Forbidden()
			}

			/** Instantiate the user connector */
			const instance = new User()
			/** Find all verified users */
			const users = await instance.find({
				verified: true,
			})
			/** Return the result */
			return users
		}),
	},
	Mutation: {
		updateUser: helmet(async (_, { input }) => {
			try {
				/** Instantiate the user connector */
				const instance = new User()
				/** Update User Information */
				const user = await instance.update({ _id: input._id }, input)
				/** Return the result */
				return user
			} catch (error) {
				throw error
			}
		}),
		signup: helmet(async (_, { input }) => {
			try {
				/** Instantiate the user connector */
				const instance = new User()
				/** Sign User up */
				const user = await instance.signup(input)

				/** Publish the signed up spectator/user to any subscriber */
				pubsub.publish('newSpectator', { newSpectator: user, event: 'newSpectator' })

				/** send confirmation mail */
				const email = new EmailService()
				email.options = {
					to: `${user.email}`,
					html: `
						<p>Welcome ${user.name},</p>
						<p>Thank you for registering with us. Please click on the link below to confirm 
						your account and complete your registration with us.</p>
						<p>https://domain.com/ref=${user.reference}</p>
					`,
				}
				email.send()

				/** Return the result */
				return user
			} catch (error) {
				throw error
			}
		}),
		cofirmEmail: helmet(async (_, { reference }) => {
			try {
				/** Instantiate the user connector */
				const instance = new User()
				/**
				 * Confirm the User by setting the verified to true
				 * and unsetting the reference to prevent second usage
				 */
				const user = await instance.update({ reference }, { verified: true, reference: '' })
				/** Return the result */
				return user
			} catch (error) {
				throw error
			}
		}),
		login: helmet(async (_, { email, password }) => {
			try {
				/** Instantiate the user connector */
				const instance = new User()
				/** Log the user in */
				const user = await instance.login(email, password)
				/** Return the result */
				return user
			} catch (error) {
				throw error
			}
		}),
	},
	Subscription: {
		newSpectator: {
			subscribe: withFilter(
				() => pubsub.asyncIterator('newSpectator'),
				(payload, variables) => payload.event === variables.event,
			),
		},
	},
	UserOutput: {
		field: async (parent) => {
			try {
				/** Instantiate the field connector */
				const instance = new Field()
				/** Get the corresponding field entity */
				const field = await instance.findOne({ _id: parent.field })
				/** Return the result */
				return field
			} catch (error) {
				throw error
			}
		},
	},
}

export default userResolvers

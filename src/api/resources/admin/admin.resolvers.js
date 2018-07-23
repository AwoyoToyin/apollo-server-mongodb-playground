import { helmet } from '../../../utils'
import { Forbidden } from '../../responses'
import Admin from './admin.connector'

const adminResolvers = {
	Query: {
		allAdmin: helmet(async (_, __, context) => {
			/** Admin access only */
			if (!context.isAdmin) {
				throw new Forbidden()
			}

			/** Instantiate the admin connector */
			const instance = new Admin()
			/** Find all admins */
			const admins = await instance.find()
			/** Return the result */
			return admins
		}),
	},
	Mutation: {
		updateAdmin: helmet(async (_, { input }, context) => {
			try {
				/** Admin access only */
				if (!context.isAdmin) {
					throw new Forbidden()
				}

				/** Instantiate the admin connector */
				const instance = new Admin()
				/** Update Admin Information */
				const admin = await instance.update({ _id: input._id }, input)
				/** Return the result */
				return admin
			} catch (error) {
				throw error
			}
		}),
		addAdmin: helmet(async (_, { input }) => {
			try {
				/** Instantiate the admin connector */
				const instance = new Admin()
				/** Sign Admin up */
				const admin = await instance.signup(input)

				/** Return the result */
				return admin
			} catch (error) {
				throw error
			}
		}),
		adminLogin: helmet(async (_, { email, password }) => {
			try {
				/** Instantiate the admin connector */
				const instance = new Admin()
				/** Log the admin in */
				const admin = await instance.login(email, password)
				/** Return the result */
				return admin
			} catch (error) {
				throw error
			}
		}),
	},
}

export default adminResolvers

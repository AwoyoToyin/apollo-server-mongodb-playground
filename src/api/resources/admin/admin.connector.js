import { AbstractConnector } from '../shared'
import { hashPassword, isValidPassword, tokenize } from '../../../utils'
import {
	BadRequest, EmailOrPhoneExists, ServerError, WrongCredentials,
} from '../../responses'
import AdminModel from './admin.model'

export default class Admin extends AbstractConnector {
	constructor() {
		super(AdminModel)
	}

	/**
     * Sign up a admin
     * @param args object
     * @returns Promise
     */
	async signup(args) {
		try {
			/** Destructure email and password for imediate usage */
			const { email, password } = args

			/** Check for valid data */
			if (!password) {
				throw new BadRequest({ data: { reason: 'You must supply a password' } })
			}

			/** Check for uniqueness */
			const entity = await this.model.findOne({ email }).lean()

			if (entity && entity._id) {
				throw new EmailOrPhoneExists()
			}

			/** Hash the admin's password */
			const _password = await hashPassword(password)

			/** Sign Admin up */
			const admin = await new this.model({ ...args, password: _password }).save()

			/**
			 * Generate a token for the admin and
			 * return the admin object containing the generated token
			 */
			admin.token = tokenize({ userId: admin._id, isAdmin: true })

			return admin
		} catch (error) {
			if (error.name) {
				throw error
			} else {
				throw new ServerError({ data: { reason: error.message } })
			}
		}
	}

	/**
     * Log admin in
     * @param email String
     * @param password String
     * @returns Promise
     */
	async login(email, password) {
		try {
			/** Check for valid data */
			if (!email || !password) {
				throw new WrongCredentials({ data: { reason: 'You must supply a valid login details' } })
			}

			/** Ensure the admin exist */
			const entity = await this.model.findOne({ email }).lean()

			/** Throw an invalid credentials error if not found */
			if (!entity || !entity._id) {
				throw new WrongCredentials({ data: { reason: 'You must supply a valid login details' } })
			}

			/** Check for valid password */
			const valid = await isValidPassword(entity.password, password)
			/** Throw an invalid credentials error if password is not valid */
			if (!valid) {
				throw new WrongCredentials({ data: { reason: 'You must supply a valid login details' } })
			}

			/** Remove password from admin entity object which will be returned */
			entity.password = undefined

			/**
			 * Generate a token for the admin and
			 * return the admin object containing the generated token
			 */
			entity.token = tokenize({ userId: entity._id, isAdmin: true })

			return entity
		} catch (error) {
			if (error.name) {
				throw error
			} else {
				throw new ServerError({ data: { reason: error.message } })
			}
		}
	}
}

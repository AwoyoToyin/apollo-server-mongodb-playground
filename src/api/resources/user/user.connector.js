import { AbstractConnector } from '../shared'
import { hashPassword, isValidPassword, tokenize } from '../../../utils'
import {
	BadRequest, EmailOrPhoneExists, ServerError, WrongCredentials,
} from '../../responses'
import UserModel from './user.model'

export default class User extends AbstractConnector {
	constructor() {
		super(UserModel)
	}

	/**
     * Sign up a user
     * @param args object
     * @returns Promise
     */
	async signup(args) {
		try {
			/** Destructure email and password for imediate usage */
			const { email, password, phone } = args

			/** Check for valid data */
			if (!password) {
				throw new BadRequest({ data: { reason: 'You must supply a password' } })
			}

			/** Check for uniqueness */
			const entity = await this.model.findOne({
				$or: [
					{ email },
					{ phone },
				],
			}).lean()

			if (entity && entity._id) {
				throw new EmailOrPhoneExists()
			}

			/** Hash the user's password */
			const _password = await hashPassword(password)

			/** Sign User up */
			const user = await new this.model({ ...args, password: _password }).save()

			/** Generate a token for the user and return the user object containing the generated token */
			user.token = tokenize({ userId: user._id, isAdmin: false })

			return user
		} catch (error) {
			if (error.name) {
				throw error
			} else {
				throw new ServerError({ data: { reason: error.message } })
			}
		}
	}

	/**
     * Log user in
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

			/** Ensure the user exist */
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

			/** Remove password from user entity object which will be returned */
			entity.password = undefined

			/** Generate a token for the user and return the user object containing the generated token */
			entity.token = tokenize({ userId: entity._id, isAdmin: false })

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

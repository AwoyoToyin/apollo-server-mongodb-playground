import bcrypt from 'bcryptjs'
import Hashids from 'hashids'
import jwt from 'jsonwebtoken'

import Field from './api/resources/field/field.connector'
import { BadRequest, ServerError } from './api/responses/error.reponse'
import config from './config'

export function getAuthenticated(authorization) {
	try {
		if (!authorization) {
			return null
		}

		const token = authorization.replace('Bearer ', '')
		const { isAdmin } = jwt.verify(token, config.secrets.JWT_SECRET)

		return isAdmin
	} catch (error) {
		throw new ServerError({ data: { reason: 'Please log in first before performing the operation' } })
	}
}

export function hashPassword(password) {
	if (!password) {
		throw new BadRequest({ data: { reason: 'You must supply a password' } })
	}
	const salt = bcrypt.genSaltSync(10)
	return bcrypt.hash(password, salt)
}

export function isValidPassword(oldPassword, newPassword) {
	return bcrypt.compare(newPassword, oldPassword)
}

export function tokenize(data) {
	return jwt.sign(data, config.secrets.JWT_SECRET)
}

export const helmet = resolver => async (...args) => {
	try {
		/** Try to execute the actual resolver and return the result immediately */
		return await resolver(...args)
	} catch (err) {
		if (err.path) {
			throw new ServerError({ data: { reason: err.message } })
		} else if (err.name === 'ValidationError') {
			throw new BadRequest({ data: { reason: err.message } })
		} else {
			throw err
		}
	}
}

export function obscure(value) {
	/**
	 * P.S:
	 * The hash secret should probably be moved into a more secure location
	 */
	const hashids = new Hashids('somesecretehash')
	return hashids.encodeHex(value)
}

export function decode(obscured) {
	/**
	 * P.S:
	 * The hash secret should probably be moved into a more secure location
	 */
	const hashids = new Hashids('somesecretehash')
	return hashids.decode(obscured)
}

export const seedFields = async () => {
	const instance = new Field()

	const collection = await instance.find()
	if (collection.docs.length > 0) {
		return 'Fields aready seeded'
	}

	const docs = []
	/* eslint-disable no-plusplus */
	for (let i = 0; i < 20; i++) {
		docs.push({
			name: `Football Field ${i}`,
			coordinates: ['', ''],
		})
	}

	return instance.insertMany(docs)
}

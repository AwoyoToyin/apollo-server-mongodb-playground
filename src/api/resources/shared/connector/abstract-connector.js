import { BadRequest, NotFound, ServerError } from '../../../responses'
import config from '../../../../config'

export default class AbstractConnector {
	constructor(model) {
		this.model = model
	}

	/**
     * Returns a count of all documents of the model
     * @param critertia object
     * @returns Promise
     */
	async count(criteria = {}) {
		const count = await this.model.count(criteria)
		return count
	}

	/**
     * Creates an entity and return the created entity
     * @param args Promise
     */
	async create(args) {
		try {
			const entity = await this.model.create({
				...args,
			})

			const created = await this.model.findOne({ _id: entity._id })

			return created
		} catch (error) {
			throw new BadRequest({ data: { reason: error.message } })
		}
	}

	/**
     * Creates a group of documents
     * @param args Promise
     */
	async insertMany(documents = []) {
		try {
			await this.model.insertMany(documents)
			return 'Documents created successfuly'
		} catch (error) {
			throw new BadRequest({ data: { reason: error.message } })
		}
	}

	/**
     * Find and return a single model matching the search criteria
     * @param criteria object
     * @returns Promise
     */
	async findOne(criteria) {
		const entity = await this.model.findOne(criteria).lean()
		if (!entity || !entity._id) {
			throw new NotFound()
		}

		return entity
	}

	/**
     * Returns all documents of the model
     * @param critertia object - find criteria
     * @param options object - pagination options
     * @returns Promise
     */
	async find(criteria = {}, options = {}) {
		/** If no limit, set a default limit */
		if (!options.limit) options.limit = config.paginate.limit

		const documents = await this.model.paginate(criteria, options)
		return documents
	}

	/**
     * Updates an entity and return the updated entity
     * @param critertia object
     * @param args object
     * @return Promise
     */
	async update(critertia, args) {
		try {
			const response = await this.model.findOneAndUpdate(
				critertia,
				{ $set: { ...args } },
				{ new: true },
			)

			if (!response || !response._id) {
				throw new NotFound()
			}

			return response
		} catch (error) {
			if (error.name) {
				throw error
			} else {
				throw new ServerError({ data: { reason: error.message } })
			}
		}
	}

	/**
     * Deletes an entity and return the deleted entity
     * @param critertia object
     * @return Promise
     */
	async delete(critertia) {
		try {
			const response = await this.model.findOneAndDelete(critertia)
			return response
		} catch (error) {
			throw new ServerError({ data: { reason: error.message } })
		}
	}
}

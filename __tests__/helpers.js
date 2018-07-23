import { graphql } from 'graphql'
import mongoose from 'mongoose'

import schema from '../src/schema'
import config from '../src/config'

mongoose.Promise = global.Promise

const clearDatabase = async () => {
	await mongoose.connection.db.dropDatabase()
}

const connectDb = () => {
	mongoose.connect(config.db.url)
	mongoose.connection
		.once('open', () => config.logger.info('Test Mongodb running'))
		.on('error', () => config.logger.error('Test MongoDB connection error'))
}

// const dropCollection = async (collection) => {
// 	await mongoose.connection.db.dropCollection(collection)
// 	return mongoose.disconnect()
// }

const disconnectDb = async () => {
	await clearDatabase()
	config.logger.info('Test Mongodb cleared')
	return mongoose.disconnect()
}

const runQuery = async (query, variables, context) => graphql(schema, query, {}, context, variables)

export {
	connectDb,
	disconnectDb,
	mongoose,
	runQuery,
}

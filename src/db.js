import mongoose from 'mongoose'
import appConfig from './config'

export const connect = (config = appConfig) => {
	mongoose.connect(config.db.url)
	mongoose.Promise = global.Promise

	mongoose.connection
		.once('open', () => appConfig.logger.info('Mongodb running'))
		.on('error', () => appConfig.logger.error('MongoDB connection error'))
}

export default connect

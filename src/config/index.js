import { merge } from 'lodash'

import development from './development'
import logger from './logger'
import production from './production'
import testing from './testing'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'


const config = {
	port: 4000,
	expireTime: '30d',
	/** Default jwt configuration */
	secrets: {
		JWT_SECRET: 'yeezy350boost',
	},
	/** Default db configuration */
	db: {
		url: 'mongodb://localhost:27017/solGokada',
	},
	/** Default email configuration */
	email: {
		service: 'gmail', // could use other services
		auth: {
			user: 'youremail',
			pass: 'yourpassword',
		},
	},
	/** Default pagination limit */
	paginate: {
		limit: 10,
	},
	logger,
}

/** Override above configuration with environment config */
let envConfig = {}

const env = process.env.NODE_ENV

switch (env) {
case 'development':
	envConfig = development
	break
case 'production':
	envConfig = production
	break
case 'test':
	envConfig = testing
	break
default:
	envConfig = config
}

export default merge(config, envConfig)

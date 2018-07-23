// import cors from 'cors'
import { formatError } from 'apollo-errors'
import { ApolloServer } from 'apollo-server'
import appConfig from './config'
import { connect } from './db'
import schema from './schema'
import { getAuthenticated, seedFields } from './utils'

const server = new ApolloServer({
	schema,
	formatError,
	context: ({ req }) => {
		let isAdmin = null

		if (req) {
			isAdmin = getAuthenticated(req.headers.authorization)
		}

		return {
			isAdmin,
		}
	},
})

// database connection
connect()

// Seed fields into the db
seedFields()
	.then(result => appConfig.logger.info(`${result}`))
	.catch(error => appConfig.logger.error(`Fields could not be seeded: ${error}`))

server.listen({ port: appConfig.port }).then(({ url, subscriptionsUrl }) => {
	appConfig.logger.info(`🚀 Server started at ${url}`)
	appConfig.logger.info(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
}).catch(e => appConfig.logger.error(`Server could not be started: ${e}`))

import { makeExecutableSchema } from 'apollo-server'
import { merge } from 'lodash'

import adminResolvers from './api/resources/admin/admin.resolvers'
import fieldResolvers from './api/resources/field/field.resolvers'
import { baseType } from './api/resources/shared'
import userResolvers from './api/resources/user/user.resolvers'

const SchemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`

const schema = makeExecutableSchema({
	typeDefs: [
		SchemaDefinition,
		baseType,
	],
	resolvers: merge(
		adminResolvers,
		userResolvers,
		fieldResolvers,
	),
})

export default schema

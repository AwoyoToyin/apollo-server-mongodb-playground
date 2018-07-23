import UserOutput from './user-output.schema'

const UserCollection = `
  type UserCollection {
      docs: [UserOutput]
      total: Int
      limit: Int
      offset: Int
      page: Int
      pages: Int
  }
`
// add other dependencies in the export
export default () => [
	UserOutput,
	UserCollection,
]

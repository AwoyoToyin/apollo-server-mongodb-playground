import AdminOutput from './admin-output.schema'

const AdminCollection = `
  type AdminCollection {
    docs: [AdminOutput]
    total: Int
    limit: Int
    offset: Int
    page: Int
    pages: Int
  }
`
// add other dependencies in the export
export default () => [
	AdminOutput,
	AdminCollection,
]

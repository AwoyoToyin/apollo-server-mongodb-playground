import FieldOutput from './field-output.schema'

const FieldCollection = `
  type FieldCollection {
      docs: [FieldOutput]
      total: Int
      limit: Int
      offset: Int
      page: Int
      pages: Int
  }
`
// add other dependencies in the export
export default () => [
	FieldOutput,
	FieldCollection,
]

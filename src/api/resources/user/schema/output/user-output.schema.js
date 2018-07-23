import { FieldOutput } from '../../../field'

const UserOutput = `
  type UserOutput {
    _id: ID
    name: String
    email: String
    phone: String
    verified: Boolean
    field: FieldOutput
    createdAt: String
    updatedAt: String
  }
`
// add other dependencies in the export
export default () => [
	UserOutput,
	FieldOutput,
]

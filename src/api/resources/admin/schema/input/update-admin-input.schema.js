import AdminRole from '../enum/role-enum.schema'

const UpdateAdminInput = `
  input UpdateAdminInput {
    _id: ID!
    name: String
    email: String
    role: AdminRole
  }
`
// add other dependencies in the export
export default () => [
	AdminRole,
	UpdateAdminInput,
]

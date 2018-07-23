import AdminRole from '../enum/role-enum.schema'

const CreateAdminInput = `
  input CreateAdminInput {
    name: String!
    email: String!
    password: String!
    role: AdminRole!
  }
`
// add other dependencies in the export
export default () => [
	AdminRole,
	CreateAdminInput,
]

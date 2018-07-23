const CreateUserInput = `
  input CreateUserInput {
    name: String!
    email: String!
    phone: String!
    password: String!
    field: String!
  }
`
// add other dependencies in the export
export default () => [CreateUserInput]

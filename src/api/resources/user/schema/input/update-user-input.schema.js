const UpdateUserInput = `
  input UpdateUserInput {
    _id: ID!
    name: String
    email: String
    phone: String
  }
`
// add other dependencies in the export
export default () => [UpdateUserInput]

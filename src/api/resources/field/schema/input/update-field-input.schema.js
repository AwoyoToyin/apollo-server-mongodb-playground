const UpdateFieldInput = `
  input UpdateFieldInput {
    _id: ID!
    name: String
    coordinates: [String]
  }
`
// add other dependencies in the export
export default () => [UpdateFieldInput]

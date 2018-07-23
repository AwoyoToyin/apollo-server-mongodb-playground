const CreateFieldInput = `
  input CreateFieldInput {
    name: String!
    coordinates: [String!]!
  }
`
// add other dependencies in the export
export default () => [CreateFieldInput]

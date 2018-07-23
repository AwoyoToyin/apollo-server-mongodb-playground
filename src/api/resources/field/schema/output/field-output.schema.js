const FieldOutput = `
  type FieldOutput {
    _id: ID
    name: String
    coordinates: [String]
    trashed: Boolean
    votes: Int
    createdAt: String
    updatedAt: String
  }
`
// add other dependencies in the export
export default () => [FieldOutput]

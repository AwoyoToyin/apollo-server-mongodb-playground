const AdminOutput = `
  type AdminOutput {
    _id: ID
    name: String
    email: String
    role: String
    createdAt: String
    updatedAt: String
  }
`
// add other dependencies in the export
export default () => [AdminOutput]

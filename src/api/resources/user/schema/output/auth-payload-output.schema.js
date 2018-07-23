const AuthPayload = `
  type AuthPayload {
    _id: ID
    email: String
    reference: String
    token: String
    createdAt: String
    updatedAt: String
  }
`
// add other dependencies in the export
export default () => [AuthPayload]

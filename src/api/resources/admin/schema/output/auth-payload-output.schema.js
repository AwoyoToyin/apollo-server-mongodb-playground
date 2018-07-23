const AdminAuthPayload = `
  type AdminAuthPayload {
    _id: ID
    email: String
    token: String
  }
`
// add other dependencies in the export
export default () => [AdminAuthPayload]

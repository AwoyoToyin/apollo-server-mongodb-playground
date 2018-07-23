import { gql } from 'apollo-server'
import {
	CreateFieldInput, UpdateFieldInput, FieldCollection, FieldOutput,
} from '../field'
import {
	AuthPayload, CreateUserInput, UpdateUserInput, UserCollection, UserOutput,
} from '../user'
import {
	AdminAuthPayload, CreateAdminInput, UpdateAdminInput, AdminCollection, AdminOutput,
} from '../admin'

const Schema = gql`
  type Query {
    allAdmin(page: Int, limit: Int): AdminCollection

    users(page: Int, limit: Int): UserCollection
    verifiedUsers(page: Int, limit: Int): UserCollection
    user(_id: ID!): UserOutput

    fields(page: Int, limit: Int): FieldCollection
    trashedFields(page: Int, limit: Int): FieldCollection
    field(_id: ID!): FieldOutput
  }

  type Mutation {
    addAdmin(input: CreateAdminInput!): AdminAuthPayload
    adminLogin(email: String!, password: String!): AdminAuthPayload
    updateAdmin(input: UpdateAdminInput!): AdminOutput

    signup(input: CreateUserInput!): AuthPayload
    cofirmEmail(reference: String!): UserOutput
    login(email: String!, password: String!): AuthPayload
    updateUser(input: UpdateUserInput!): UserOutput

    createField(input: CreateFieldInput!): FieldOutput
    updateField(input: UpdateFieldInput!): FieldOutput
    trashField(_id: ID!): FieldOutput
    deleteField(_id: ID!): FieldOutput
  }

  type Subscription {
    newSpectator(event: String!): UserOutput

    fieldCreated(event: String!): FieldOutput
    fieldUpdated(event: String!): FieldOutput
    fieldDeleted(event: String!): FieldOutput
  }
`
export default () => [
	Schema,

	AdminCollection,
	AdminOutput,
	AdminAuthPayload,
	UpdateAdminInput,
	CreateAdminInput,

	AuthPayload,
	UpdateUserInput,
	CreateUserInput,
	UserCollection,
	UserOutput,

	CreateFieldInput,
	UpdateFieldInput,
	FieldCollection,
	FieldOutput,
]

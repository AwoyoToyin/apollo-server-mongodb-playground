# A Field day Solution

## Prerequisites

- [Node.js](https://nodejs.org/en/) v8
- [Yarn](https://yarnpkg.com/en/) Prefered
- [Mongodb](https://mongodb.com/)

## Getting Started

1. `git clone ` + repo URL
2. `cd` to repo
3. `yarn` - installing node packages

## Configuration

Open the `src -> config -> index.js` or other environment files

Email: The email service uses `gmail` by default
Replace the placeholders with your actual email login details
```
auth: {
  user: 'youremail',
  pass: 'yourpassword',
}
```

### P.S: Go crazy with the configuration files


Start server

`yarn start` - This also seeds 20 fields into the db

To run eslint - find lint errors

`yarn lint`

To run tests

`yarn test`

`yarn run test-watch` - watches for file changes and auto run tests

## GraphQL Playground Queries & Mutations

P.S: `!` denote a required parameter
====================================

## Admin

### Mutations

Admin SignUp
```
mutation addAdmin($input: CreateAdminInput!) {
  addAdmin(input: $input) {
    _id
    email
    token
  }
}

### Query Variables
{
  "input": {
    "name": "Akande Maruwa",
    "email": "a.lekki@gmail.com",
    "password": "password",
    "role": "administrator", // enum: ["administrator", "supervisor"]
  }
}
```

Admin Login
```
mutation {
  adminLogin(
    email: "a.lekki@gmail.com"
    password: "password"
  ) {
    _id
    email
    token
  }
}
```

Admin Update
```
mutation($input: UpdateAdminInput!) {
  updateAdmin(input: $input") {
    _id
    name
    email
    role
    createdAt
    updatedAt
  }
}

### Query Variables
{
  "input": {
    "_id": "the-spectator-id", // required
    "name": "Akande Yaba",
    "email": "a.lekki@gmail.com",
    "role": "supervisor",
  }
}

### HTTP HEADERS
{
  "authorization": "Bearer __ADMIN_TOKEN__"
}
```

### Query

Fetch all Admin
```
query($page: Int, $limit: Int) {
  allAdmin(page: $page, limit: $limit) {
    docs {
      _id
      name
      email
      role
      createdAt
      updatedAt
    }
    total
    limit
    offset
    page
    pages
  }
}

### Query Variables
{
  "page": 1, // optional
  "limit": 5 // optional
}

### HTTP HEADERS
{
  "authorization": "Bearer __ADMIN_TOKEN__"
}
```


## Spectators

### Mutations

Spectator SignUp
```
mutation signup($input: CreateUserInput!) {
  signup(input: $input) {
    _id
    email
    reference
    token
  }
}

### Query Variables
{
  "input": {
    "name": "Akande Lekki",
    "email": "a.lekki@gmail.com",
    "phone": "09028476798",
    "password": "password",
    "field": "some-field-Id",
  }
}
```

Spectator Login
```
mutation {
  login(
    email: "a.lekki@gmail.com"
    password: "password"
  ) {
    _id
    email
    token
  }
}
```

Cofirming Email - Confirm your email by passing in the reference generated from signing up
```
mutation {
  cofirmEmail(reference: "somereference") {
    _id
    name
    email
    phone
    verified
    field
    createdAt
    updatedAt
  }
}
```

Spectator Update
```
mutation($input: UpdateUserInput!) {
  updateUser(input: $input") {
    _id
    name
    email
    phone
    verified
    field
    createdAt
    updatedAt
  }
}

### Query Variables
{
  "input": {
    "_id": "the-spectator-id", // required
    "name": "Akande Yaba",
    "email": "a.lekki@gmail.com",
    "phone": "09028476798",
  }
}
```

### Query

Fetch a single Spectators
```
query {
  user(_id: "some-spector-id") {
    _id
    name
    email
    phone
    verified
    field {
      _id
      name
      coordinates
      votes
    }
    createdAt
    updatedAt
  }
}

### HTTP HEADERS
{
  "authorization": "Bearer __ADMIN_TOKEN__"
}
```

Fetch all Spectators
```
query($page: Int, $limit: Int) {
  users(page: $page, limit: $limit) {
    docs {
      _id
      name
      email
      phone
      verified
      field {
        _id
        name
        coordinates
        votes
      }
      createdAt
      updatedAt
    }
    total
    limit
    offset
    page
    pages
  }
}

### Query Variables
{
  "page": 1, // optional
  "limit": 5 // optional
}

### HTTP HEADERS
{
  "authorization": "Bearer __ADMIN_TOKEN__"
}
```

Fetch all Verified Spectators
```
query($page: Int, $limit: Int) {
  verifiedUsers(page: $page, limit: $limit) {
    docs {
      _id
      name
      email
      phone
      verified
      field {
        _id
        name
        coordinates
        votes
      }
      createdAt
      updatedAt
    }
    total
    limit
    offset
    page
    pages
  }
}

### Query Variables
{
  "page": 1, // optional
  "limit": 5 // optional
}

### HTTP HEADERS
{
  "authorization": "Bearer __ADMIN_TOKEN__"
}
```

## Fields

### Mutation

Create Field
```
mutation($input: CreateFieldInput!) {
  createField(input: $input) {
    _id
    name
    coordinates
    trashed
    votes
    createdAt
    updatedAt
  }
}

### Query Variables
{
  "input": {
    "name": "Ota Stadium",
    "coordinates": ["", ""]
  }
}

### HTTP HEADERS
{
  "Authorization": "Bearer __ADMIN_TOKEN__"
}
```

Update Field
```
mutation($input: UpdateFieldInput!) {
  updateField(input: $input) {
    _id
    name
    coordinates
    trashed
    votes
    createdAt
    updatedAt
  }
}

### Query Variables
{
  "input": {
    _id: "5a6437d5cacbed9e62630e13", // required
    "name": "YabaLeft Stadium",
    "coordinates": ["someLat", "someLong"]
  }
}

### HTTP HEADERS
{
  "Authorization": "Bearer __ADMIN_TOKEN__"
}
```

Soft Delete a Field
```
mutation {
  trashField(
    _id: "5a6437d5cacbed9e62630e13"
  ) {
    _id
    name
    coordinates
    trashed
    votes
    createdAt
    updatedAt
  }
}

HTTP HEADERS
{
  "Authorization": "Bearer __ADMIN_TOKEN__"
}
```

Permanently Delete a Field
```
mutation {
  deleteField(
    _id: "5a6437d5cacbed9e62630e13"
  ) {
    _id
    name
    coordinates
    trashed
    votes
    createdAt
    updatedAt
  }
}

### HTTP HEADERS
{
  "Authorization": "Bearer __ADMIN_TOKEN__"
}
```

### Query

Fetch all fields - Results are limited to 10 per page
```
query {
  fields {
    docs {
      _id
      name
      trashed
      votes
      createdAt
      updatedAt
  	}
    total
    limit
    offset
    page
    pages
  }
}

Setting a limit

query {
  fields(limit: 5) {
    docs {
      _id
      name
      trashed
      votes
      createdAt
      updatedAt
  	}
    total
    limit
    offset
    page
    pages
  }
}

fetching next page

query {
  fields(page: 2, limit: 5) {
    docs {
      _id
      name
      trashed
      votes
      createdAt
      updatedAt
  	}
    total
    limit
    offset
    page
    pages
  }
}
```

Fetch all Trashed fields - Results are similar to querying all fields
```
query {
  trashedFields {
    docs {
      _id
      name
      trashed
      votes
      createdAt
      updatedAt
  	}
    total
    limit
    offset
    page
    pages
  }
}

...Other paginated queries

### HTTP HEADERS
{
  "Authorization": "Bearer __ADMIN_TOKEN__"
}
```

Fetch a single field
```
query {
  field(_id: "some-field-id") {
    _id
    name
    trashed
    votes
    createdAt
    updatedAt
}
```


### Subscriptions
P.S: All available real time communication are listed below
===========================================================

Subscribing and getting notified when a new Spectator signs up
```
subscription {
  newSpectator(event: "newSpectator") {
    _id
    name
    email
    phone
    verified
    field {
      _id
      name
      trashed
      votes
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
```

Subscribing and getting notified when a new Field is created
```
subscription {
  fieldCreated(event: "fieldCreated") {
    _id
    name
    trashed
    votes
    createdAt
    updatedAt
  }
}
```

Subscribing and getting notified when a Field is updated
```
subscription {
  fieldUpdated(event: "fieldUpdated") {
    _id
    name
    trashed
    votes
    createdAt
    updatedAt
  }
}
```

Subscribing and getting notified when a Field is deleted permanently
```
subscription {
  fieldDeleted(event: "fieldDeleted") {
    _id
    name
    trashed
    votes
    createdAt
    updatedAt
  }
}
```


## Better Error Handler

```
{
  "data": {
    "login": null
  },
  "errors": [
    {
      "message": "The provided credentials are invalid.",
      "name": "WrongCredentials",
      "time_thrown": "2018-05-14T22:34:26.241Z",
      "data": {}
    }
  ]
}
```

import { createError } from 'apollo-errors'

export const WrongCredentials = createError('WrongCredentials', {
	message: 'The provided credentials are invalid.',
})

export const BadRequest = createError('BadRequest', {
	message: 'The request cannot be fulfilled due to bad syntax.',
})

export const NotFound = createError('NotFound', {
	message: 'The requested resource could not be found but may be available again in the future.',
})

export const Forbidden = createError('Forbidden', {
	message: 'Not authorized to perform this operation.',
})

export const EmailOrPhoneExists = createError('EmailOrPhoneExists', {
	message: 'A user with similar account information already exist. Please login with your registered login details.',
})

export const EmailSendError = createError('EmailSendError', {
	message: 'Could not send email.',
})

export const ServerError = createError('ServerError', {
	message: 'Something bad happened on the server.',
})

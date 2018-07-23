import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import uniqueValidator from 'mongoose-unique-validator'

import { obscure } from '../../../utils'

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		trim: true,
	},
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, 'email is required'],
		match: [/\S+@\S+\.\S+/, 'supplied email is invalid'],
		trim: true,
	},
	phone: {
		type: String,
		unique: true,
		required: [true, 'phone is required'],
		trim: true,
		// match: [/^(\+234|([0]{1})([7-9]{1})([0|1]{1}))([0-9]{6,14})$/, 'is invalid'],
	},
	password: {
		required: [true, 'password is required'],
		type: String,
	},
	/** Holds a hashed string for email confirmation */
	reference: {
		type: String,
		index: true,
	},
	/** flag for email confirmation */
	verified: {
		type: Boolean,
		default: false,
		index: true,
	},
	field: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'field',
		required: [true, 'football field is required'],
	},
}, { timestamps: true })

userSchema.plugin(uniqueValidator, { message: 'is already taken.' })

userSchema.plugin(mongoosePaginate)

userSchema.post('validate', (doc) => {
	if (!doc.reference) {
		doc.reference = obscure(doc._id)
	}
})

const User = mongoose.model('user', userSchema)

export default User

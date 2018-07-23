import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import uniqueValidator from 'mongoose-unique-validator'

const adminSchema = new mongoose.Schema({
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
	password: {
		required: [true, 'password is required'],
		type: String,
	},
	role: {
		required: [true, 'role is required'],
		type: String,
	},
}, { timestamps: true })

adminSchema.plugin(uniqueValidator, { message: 'is already taken.' })

adminSchema.plugin(mongoosePaginate)

const Admin = mongoose.model('admin', adminSchema)

export default Admin

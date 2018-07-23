import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

const fieldSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		trim: true,
	},
	coordinates: [String],
	trashed: {
		type: Boolean,
		default: false,
		index: true,
	},
}, { timestamps: true })

fieldSchema.plugin(mongoosePaginate)

const Field = mongoose.model('field', fieldSchema)

export default Field

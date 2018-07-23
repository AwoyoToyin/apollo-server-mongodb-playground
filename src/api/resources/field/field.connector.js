import { AbstractConnector } from '../shared'
import FieldModel from './field.model'

export default class Field extends AbstractConnector {
	constructor() {
		super(FieldModel)
	}
}

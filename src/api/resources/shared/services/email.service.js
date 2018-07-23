import nodemailer from 'nodemailer'
import { EmailSendError } from '../../../responses'
import config from '../../../../config'

export default class Email {
	constructor() {
		this.transporter = nodemailer.createTransport(config.email)
	}

	/**
     * Set the options for the mail
     */
	set options(mailOptions) {
		this.mailOptions = {
			from: '"Gokada 🏍️" <busola@gokada.com>', // sender address
			subject: 'Your local football fields', // Subject line
			...mailOptions,
		}
	}

	/**
     * Get the options for the mail
     */
	get options() {
		return this.mailOptions
	}

	/**
     * Send the mail
     * This could be optimized to use queueing system
     */
	send() {
		this.transporter.sendMail(this.options, (error) => {
			if (error) {
				config.logger.error(`Could not send email: ${error}`)
				throw new EmailSendError()
			}

			config.logger.info(`Message sent from: ${this.options.from} to: ${this.options.to}`)
		})
	}
}

import fs from 'fs'
import { createLogger, format, transports } from 'winston'

const {
	combine, timestamp, label, printf,
} = format

/** Configuring logger */
const logDir = 'logs'
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

/** Custom log format */
const customFormat = printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`)

const logger = createLogger({
	level: 'info',
	format: combine(
		format.colorize(),
		label({ label: 'winston!' }),
		timestamp(),
		customFormat,
	),
	transports: [
		//
		// - Write to all logs with level `info` and below to `logs/combined.log`
		// - Write all logs error (and below) to `logs/error.log`.
		//
		new transports.File({ filename: `${logDir}/error.log`, level: 'error' }),
		new transports.File({ filename: `${logDir}/combined.log` }),
	],
	exitOnError: false,
})

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
	logger.add(new transports.Console({
		format: combine(
			format.colorize(),
			label({ label: 'winston!' }),
			timestamp(),
			customFormat,
		),
	}))
}

export default logger

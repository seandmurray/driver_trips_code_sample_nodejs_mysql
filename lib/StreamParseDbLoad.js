/*jshint esversion: 6 */
const stream = require("stream");

// This is a library I wrote and is on github/npmjs.
const isit = require('prose_isit');

// This is a local library in this same directory.
const utils = require("./Utils");

const SEPERATORS = /\s+/;
const OPERATION_DRIVER = 'driver';
const OPERATION_TRIP = 'trip';

const MILES_MAX = 100;
const MILES_MIN = 5;
const SQL_DRIVER_ADD = 'CALL driverAdd(?,?)';
const SQL_TRIP_ADD = 'CALL tripAdd(?,?,?,?,?,?,?)';

module.exports = class extends stream.Transform {
	constructor(options) {
		super(options);
		this._uuid = options.uuid;
		this._connection = options.connection;
	}

	_transform(chunk, encoding, callback) {
		const data = chunk.toString().trim().split(SEPERATORS);
		const operation = data.shift().toLowerCase();
		switch (operation) {
		case OPERATION_DRIVER:
			const driver = utils.parseDriver(data);
			if (isit.notNil(driver)) {
				this._connection.query(SQL_DRIVER_ADD, [this._uuid, driver], (err) => {
					if(err) throw err;
				});
				callback();
			}
			break;
		case OPERATION_TRIP:
			const trip = utils.parseTrip(data);
			if (isit.notNil(trip)) {
				this._connection.query(SQL_TRIP_ADD, [this._uuid, trip.name, trip.start, trip.stop, trip.miles, MILES_MIN, MILES_MAX], (err) => {
					if(err) throw err;
					callback();
				});
			}
			break;
		default:
			console.error('Unkown operation: "' + operation + '"');
			callback();
		}
	}
};

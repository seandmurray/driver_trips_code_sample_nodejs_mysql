const fs = require('fs');
const uuid = require('uuid/v4');

// These are libraries I wrote and are on github/npmjs.
const array_util = require('prose_array');
const file_util = require('prose_file');
const os_util = require('prose_os');
const string_util = require('prose_string');

// These are local libraries located in the lib directory.
const StreamParseDbLoad = require('./lib/StreamParseDbLoad');
const StreamReportMilesSpeed = require('./lib/StreamReportMilesSpeed');
const StreamReportNoMiles = require('./lib/StreamReportNoMiles');
const DB = require('./lib/DB');

const SQL_REPORT_MILES_SPEED = 'CALL reportMilesSpeed(?)';
const SQL_REPORT_NO_MILES = 'CALL reportNoMiles(?)';
const SQL_CLEAN = 'CALL clean(?)';

const CLI_ERR = 'One argument expected. The file/paht of a valid Driver/Trip file';

const ID = uuid();
const CONNECTION = DB.connection();
const FILE_PATH = getFilePath();

const fileStream = fs.createReadStream(FILE_PATH);
const streamParseDbLoad = new StreamParseDbLoad({ connection: CONNECTION, uuid: ID });
const streamReadLines = new file_util.StreamReadLines();
const streamReportMilesSpeed = new StreamReportMilesSpeed({ objectMode: true });
const streamReportNoMiles = new StreamReportNoMiles({ objectMode: true });

function getFilePath() {
	const cliArgs = os_util.getCommandLineArguments();
	if (array_util.isEmpty(cliArgs)) throw new Error(CLI_ERR);
	const result = cliArgs.pop();
	if (string_util.isBlank(result)) throw new Error(CLI_ERR);
	if (file_util.notExists(result)) throw new Error('The input file does not appear to exist?');
	return result;
}

// Stream the contents file to a transform object that will parse the data into lines.
// Then stream those lines to tranform object that will parse, validate and load into
// a DB.
fileStream
	.pipe(streamReadLines)
	.pipe(streamParseDbLoad);

// When the streamParseDbLoad is done, this method is called.
// This methdo will call the Report DB stored procedure
// And that report data is streamed to the writable object streamReportMilesSpeed,
// which handles formating and printing the data.
streamParseDbLoad.on('finish', () => {
	CONNECTION.query(SQL_REPORT_MILES_SPEED, ID)
		.stream()
		.pipe(streamReportMilesSpeed);
});

// When the streamReportMilesSpeed is done, this method is called.
streamReportMilesSpeed.on('finish', () => {
	CONNECTION.query(SQL_REPORT_NO_MILES, ID)
		.stream()
		.pipe(streamReportNoMiles);
});

// When the streamReportNoMiles is done, this method is called.
// Does DB cleanup.
streamReportMilesSpeed.on('finish', () => {
	//CONNECTION.query(SQL_CLEAN, ID, () => {
		CONNECTION.end();
	//});
});

// The items below ensure that any error in the related object are output.
streamParseDbLoad.on('error', (err) => {
	console.log(err);
});

streamReadLines.on('error', (err) => {
	console.log(err);
});

streamReportMilesSpeed.on('error', (err) => {
	console.log(err);
});

streamReportNoMiles.on('error', (err) => {
	console.log(err);
});

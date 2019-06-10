# driver_trips_code_sample_nodejs_mysql

## Problem Statement

Track trip/driving history.

Takes a file name on the command line.

Each line in the input file will start with a command. There are two possible commands.

The first command is Driver, which will register a new Driver in the app. Example:

`Driver Dan`

The second command is Trip, which will record a trip attributed to a driver. The line will be space delimited with the following fields: the command (Trip), driver name, start time, stop time, miles driven. Times will be given in the format of hours:minutes. We'll use a 24-hour clock and will assume that drivers never drive past midnight (the start time will always be before the end time). Example:

`Trip Dan 07:15 07:45 17.3`

Will discard any trips that average a speed of less than 5 mph or greater than 100 mph.

Generate a report containing each driver with total miles driven and average speed. Sort the output by most miles driven to least. Round miles and miles per hour to the nearest integer.

Example input:

```
Driver Dan
Driver Alex
Driver Bob
Trip Dan 07:15 07:45 17.3
Trip Dan 06:12 06:32 21.8
Trip Alex 12:01 13:16 42.0
```

Expected output:

```
Alex: 42 miles @ 34 mph
Dan: 39 miles @ 47 mph
Bob: 0 miles
```

## REQUIREMENTS:

node (v8 or greater), npm (v6 or greater). Consider using nvm to install both of theses: 'https://github.com/nvm-sh/nvm'.

A MySQL Database with rights to create schemas, user/passwords, tables, stored procedures.

While in the top directory for this code, run in order:
	* npm install
	* npm test

## SETUP:

Set up the database. Connect to the target database and then run:
'source <path/to/>schema.sql'.

Create a test file. There is a bash script included for functional testing: 'generateTestFile.sh'. 

Change the RUN.sh script. Update the DB_HOST with your DB host name and uncomment the line.

## RUN IT: 

While in the directory where the RUN.sh is, run that command.

## WHY:

I used Node for this example because it's the language I have been using the most lately.  Like more dynamic languages it can get a lot done with less code.  But in particular it is very well suited to streaming through large data sets using simple objects in a pipeline to achieve very complex operations. All with little memory usage.

I used MySQL DB and stored procedures to store the data and then generate the report.  MySQL has built in time types and methods to handle converting time strings to time and methods find an interval between two times.  In addition it easily can handle duplicates.  And most importantly it makes creating the final coalesced report very easy.


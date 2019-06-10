-- This is the Database schema file.
-- Run it in your target MySQL compatible database.
-- It will create the schema, table and procedures for the program to work.

-- Recomend you change the schema/login/user values.
USE mysql;
DROP USER 'drivertrips'@'%';
DROP SCHEMA IF EXISTS drivertrips;
CREATE SCHEMA IF NOT EXISTS drivertrips;
USE sdmdrivertrips;

CREATE USER 'sdmdrivertrips'@'%' IDENTIFIED BY 'tbwmrnrb';
GRANT DELETE, EXECUTE, INSERT, SELECT, UPDATE ON sdmdrivertrips.* TO 'sdmdrivertrips'@'%';

CREATE TABLE driver (
	uuid CHAR(36) NOT NULL,
	id VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	PRIMARY KEY (uuid, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE trip (
	uuid CHAR(36) NOT NULL,
	driver_id VARCHAR(255) NOT NULL,
	miles DECIMAL(5,2) NOT NULL,
	speed DECIMAL(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE INDEX drivertrips ON trip(uuid, driver_id);

DELIMITER //
CREATE PROCEDURE driverAdd (IN in_uuid CHAR(36), IN in_name VARCHAR(255))
BEGIN
	DECLARE _driver_id VARCHAR(255) DEFAULT LOWER(in_name);
	INSERT IGNORE INTO driver VALUES (in_uuid, _driver_id, in_name);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE tripAdd (IN in_uuid CHAR(36), IN in_name VARCHAR(255), IN in_start TIME, IN in_stop TIME, IN in_miles DECIMAL(5,2), IN in_min DECIMAL(5,2), IN in_max DECIMAL(5,2))
BEGIN
	DECLARE _driver_id VARCHAR(255) DEFAULT LOWER(in_name);
	DECLARE _diff DECIMAL(5,2);
	DECLARE _speed DECIMAL(5,2);
	SELECT (TIME_TO_SEC(TIMEDIFF(in_stop, in_start)))/(3600) INTO _diff;
	SELECT in_miles/_diff INTO _speed;
	IF (_speed > in_min) && (_speed < in_max) THEN
		INSERT INTO trip VALUES (in_uuid, _driver_id, in_miles, _speed);
	END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE reportMilesSpeed(IN in_uuid CHAR(36))
BEGIN
	SELECT
		d.name,
		t.miles,
		speed
	FROM driver d
	JOIN trip t ON t.driver_id = d.id && t.uuid = d.uuid
	WHERE d.uuid = in_uuid
	ORDER BY d.name;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE reportNoMiles(IN in_uuid CHAR(36))
BEGIN
	SELECT
		d.name
	FROM driver d
	LEFT JOIN trip t ON t.driver_id = d.id && t.uuid = d.uuid
	WHERE d.uuid = in_uuid
	AND t.uuid IS NULL
ORDER BY d.name;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE clean(IN in_uuid CHAR(36))
BEGIN
	DELETE FROM driver WHERE uuid = in_uuid;
	DELETE FROM trip WHERE uuid = in_uuid;
END //
DELIMITER ;


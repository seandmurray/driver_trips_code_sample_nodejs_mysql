/*jshint esversion: 6 */

// This is a the test program.
// Run using "npm test" in parent directory.

const assert = require('assert');
const utils = require('../lib/Utils');
const isit = require("prose_isit");

let result;
let id;
let tmp1;
let tmp2;
let tmp3;
let tmp4;

// utils.parseDriver
result = utils.parseDriver();
assert.equal(isit.nil(result), true, 'Nothing returned');
tmp1 = 'John';
id = tmp1.toLocaleLowerCase();
result = utils.parseDriver([tmp1]);
assert.equal(result, tmp1, 'Valid driver name');
tmp2 = '';
result = utils.parseDriver([tmp2]);
assert.equal(isit.nil(result), true, 'Nothing returned');
tmp2 = 'Doris';
tmp3 = 'Day';
tmp4 = [tmp2, tmp3];
result = utils.parseDriver(tmp4);
assert.equal(result, tmp4.join(' '), 'Valid driver name');
console.log('Utils.parseDriver test success');

// utils.parseTrip
result = utils.parseTrip();
assert.equal(isit.nil(result), true, 'Nothing returned');
tmp1 = 'John';
tmp2 = '1:23';
tmp3 = '2:45';
tmp4 = '6.78';
result = utils.parseTrip([tmp1, tmp2, tmp3, tmp4]);
assert.equal(result.name, tmp1, 'Valid driver name');
assert.equal(result.start, tmp2, 'Valid start');
assert.equal(result.stop, tmp3, 'Valid stop');
assert.equal(result.miles, Number(tmp4), 'Valid miles');
tmp1 = '   ';
result = utils.parseTrip([tmp1, tmp2, tmp3, tmp4]);
assert.equal(isit.nil(result), true, 'Nothing returned');
tmp2 = 'a:23';
result = utils.parseTrip([tmp1, tmp2, tmp3, tmp4]);
assert.equal(isit.nil(result), true, 'Nothing returned');
tmp3 = 'b';
result = utils.parseTrip([tmp1, tmp2, tmp3, tmp4]);
assert.equal(isit.nil(result), true, 'Nothing returned');
tmp4 = 'x';
result = utils.parseTrip([tmp1, tmp2, tmp3, tmp4]);
assert.equal(isit.nil(result), true, 'Nothing returned');
console.log('Utils.parseTrip test success');

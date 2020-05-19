// Tests. Mocha TDD/assert style. See
// http://visionmedia.github.com/mocha/
// http://nodejs.org/docs/latest/api/assert.html

var assert = require('assert')
var simple = require('simple-mock')
var geoip = require('geoip-lite')

var log = console.log.bind(console)

var geoIP = require('../index.js')('UK');

// Known addresses
var US_IP = '108.60.143.242'
var AU_IP = '139.130.4.5'
var HU_IP = '172.68.226.56';

suite('geoips', function () {
	test('correctly handles US and AU addresses', function () {
		assert.equal(geoIP.getCountryCode(US_IP), 'US')
		assert.equal(geoIP.getCountryCode(AU_IP), 'AU')
	});
});

suite('middleware', function () {
	setup(function () {
		simple.mock(geoip, 'lookup');
	});

	teardown(function () {
		simple.restore();
	});

	test('use ip from x-forwarded-for for lookup', function () {
		var fakeReq = {
			headers: {
				'x-forwarded-for': US_IP,
			},
		};
		geoIP.getCountryCodeMiddleware(fakeReq, {}, simple.stub());
		assert.equal(geoip.lookup.lastCall.arg, US_IP);
	});
	
	test('use first ip from x-forwarded-for for lookup', function () {
		var fakeReq = {
			headers: {
				'x-forwarded-for': [HU_IP, AU_IP, US_IP].join(', '),
			},
		};
		geoIP.getCountryCodeMiddleware(fakeReq, {}, simple.stub());
		assert.equal(geoip.lookup.lastCall.arg, HU_IP);
	});

	test('use connection remote address for lookup when x-forwarded-for is empty', function () {
		var fakeReq = {
			headers: {},
			connection: {
				remoteAddress: AU_IP,
			}
		};
		geoIP.getCountryCodeMiddleware(fakeReq, {}, simple.stub());
		assert.equal(geoip.lookup.lastCall.arg, AU_IP);
	});
});

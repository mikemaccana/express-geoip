// Tests. Mocha TDD/assert style. See
// http://visionmedia.github.com/mocha/
// http://nodejs.org/docs/latest/api/assert.html

var assert = require('assert')

var log = console.log.bind(console)

var geoIP = require('../index.js')('UK');

// Known addresses
var US_IP = '108.60.143.242'
var AU_IP = '139.130.4.5'

suite('geoips', function(){
	this.timeout(5 * 1000);
	test('correctly handles US and AU addresses', function(){
		assert(geoIP.getCountryCode(US_IP), 'US')
		assert(geoIP.getCountryCode('139.130.4.5'), 'AU')
	});
});


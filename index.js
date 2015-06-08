var geoip = require('geoip-lite');

require('es6-shim');

module.exports = function(defaultCountryCode){
	return function getCountryCode(req, res, next) {
		// IPV6 addresses can include IPV4 addresses
		// So req.ip can be '::ffff:86.3.182.58'
		// However geoip-lite returns null for these
		var ip = req.ip
		if ( ip.includes('::ffff:') ) {
			ip = ip.split(':').reverse()[0]
		}
		var countryCode;
		var lookedUpIP = geoip.lookup(ip)
		if ( lookedUpIP && lookedUpIP.country ) {
			countryCode = lookedUpIP.country;
		}
		if ( ( ip === '127.0.0.1' ) || ( ! lookedUpIP ) ) {
			countryCode = defaultCountryCode
		}
		req.countryCode = countryCode
		next();
	}
}

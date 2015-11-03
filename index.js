var geoip = require('geoip-lite');

require('es6-shim');

module.exports = function(defaultCountryCode){
	var getCountryCode = function(ip){
		// IPV6 addresses can include IPV4 addresses
		// So req.ip can be '::ffff:86.3.182.58'
		// However geoip-lite returns null for these
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
		return countryCode
	}

	var getCountryCodeMiddleware = function(req, res, next) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		req.countryCode = getCountryCode(ip)
		next();
	}

	return {
		getCountryCodeMiddleware: getCountryCodeMiddleware,
		getCountryCode: getCountryCode,
	}
}

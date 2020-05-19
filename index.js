var geoip = require('geoip-lite');

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

	var getXForwardedFor = function(req) {
		const ips = (req.headers['x-forwarded-for'] || '').split(',')
		const ip = ips[0] ? ips[0].trim() : ''

		return ip.replace(/:\d+$/, '')
	}

	var getCountryCodeMiddleware = function(req, res, next) {
		var xForwardedFor = getXForwardedFor(req);
		var ip = xForwardedFor || req.connection.remoteAddress;
		req.countryCode = getCountryCode(ip)
		next();
	}

	return {
		getCountryCodeMiddleware,
		getCountryCode,
	}
}

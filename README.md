# Express GeoIP

Express 4 middleware to add req.countryCode, which is the ISO alpha 2 country code for a request.

## Usage

In `app.js`

	var expressGeoIP = require('express-geoip');

	app.use(expressGeoIP('US').getCountryCodeMiddleware);

Then, in your routes, check `req.countryCode` for the looked up country code.

## History

1.2.0 - Added tests, new function signature

1.0.0 - Initial release

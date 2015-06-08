# Express GeoIP

Express 4 middleware to add req.countryCode, which is the ISO alpha 2 country code mtaching req.ip, to requests.

## Usage

In `app.js`

	var expressGeoIP = require('express-geoip');

	app.use(expressGeoIP('US'));

Then, in your routes, check `req.countryCode` for the looked up country code.


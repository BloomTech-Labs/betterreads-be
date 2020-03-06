require("dotenv").config();

module.exports = {
	google: {
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET
	},
	facebook: {
		clientID: process.env.FACEBOOK_CLIENT_ID,
		clientSecret: process.env.FACEBOOK_CLIENT_SECRET
	},
	session: {
		sessionName: process.env.SESSION_NAME,
		sessionSecret: process.env.SESSION_SECRET
	}
};

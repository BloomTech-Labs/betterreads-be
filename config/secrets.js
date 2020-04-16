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
    jwtSecret: process.env.JWT_SECRET || "This is the most secretest secret to ever be secretly secret....... secret."
   
};

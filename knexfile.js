// Update with your config settings.

module.exports = {
	development: {
		client: 'postgresql',
		connection: {
			host: 'dev-sequr.cilgyyjfjbcb.us-east-1.rds.amazonaws.com',
			database: 'report',
			user:     'report',
			password: 'reportreport12'
		},
		pool: {
			min: 2,
			max: 10
		}
	}
};

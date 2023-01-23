// Web server related libraries
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// Other libraries
const tickLog = require('tick-log');
const {
	init,
	checkUser,
	createUser
} = require('./handlers');

const startServer = async () => {
	init(
		{
			bcryptKeys: {
				saltRounds: 10,
			},
			pgKeys: {
				user: 'mehmetkaplan',
				password: '',
				database: 'mehmetkaplan',
				host: 'localhost',
				port: 5432,
			}
		}
	);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(morgan('combined'));
	app.use(cors());
	app.options('*', cors());

	app.post('/registerUser', async (req, res) => {
		const { email, password, name } = req.body;
		const result = await createUser(email, password, name);
		res.send(result);
	});
	app.listen(serverParameters.port, () => {
		tickLog.success(`HTTP server listening on port ${serverParameters.port}.`);
	});
}

startServer();
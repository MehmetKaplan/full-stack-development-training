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
} = require('./handlers.js');

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

	// curl -d "email=mk100@yopmail.com&password=1234&name=mehmetkaplan" -X POST http://localhost:8080/registerUser
	app.all('/registerUser', async (req, res) => {
		const { email, password, name } = req.body;
		const result = await createUser(email, password, name);
		res.send(result);
	});

	// curl -d "email=mk100@yopmail.com&password=1234" -X POST http://localhost:8080/loginViaEmail #Authenticated
	// curl -d "email=mk100@yopmail.com&password=WRONG-PASSWORD" -X POST http://localhost:8080/loginViaEmail #passwordError
	// curl -d "email=NOTEXISTING@yopmail.com&password=1234" -X POST http://localhost:8080/loginViaEmail #userNotFound
	app.all('/loginViaEmail', async (req, res) => {
		const { email, password } = req.body;
		const result = await checkUser(email, password);
		res.send(result);
	});
	app.listen(8080, () => {
		tickLog.success(`HTTP server listening on port 8080.`);
	});
}

startServer();
const tickLog = require('tick-log');
const {
	init,
	checkUser,
	createUser
} = require('../handlers');

// before all tests call the init function
beforeAll(async () => {
	await init(
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
});

// test createUser function
test('createUser', async () => {
	let now = Date.now();
	let email = `${now}@yopmail.com`;
	let name = `${now}`;
	let password = `${now}`;
	let result = await createUser(email, password, name);
	tickLog.info(`createUser returned:\n${JSON.stringify(result, null, 2)}`, true);
});
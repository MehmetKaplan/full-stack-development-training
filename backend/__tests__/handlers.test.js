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
	expect(result.payload.length).toEqual(1);
	expect(result.payload[0]).toEqual(expect.objectContaining({
		"email": email,
		"name": name,
	}))
});

test('user already exists', async () => {
	let now = Date.now();
	let email = `${now}@yopmail.com`;
	let name = `${now}`;
	let password = `${now}`;
	let result = await createUser(email, password, name);
	let result2 = await createUser(email, password, name);
	tickLog.info(`createUser returned:\n${JSON.stringify(result2, null, 2)}`, true);
	expect(result2).toEqual({
		"result": "ERROR",
		"payload": "userAlreadyExists"
	});
});
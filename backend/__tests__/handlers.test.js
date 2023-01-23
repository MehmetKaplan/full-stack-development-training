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

/*
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
*/
test('checkUser', async () => {
	let now = Date.now();
	let email = `${now}@yopmail.com`;
	let name = `${now}`;
	let password = `${now}`;
	let result = await createUser(email, password, name);
	tickLog.info(`createUser returned:\n${JSON.stringify(result, null, 2)}`, true);
	let result2 = await checkUser(email, password);
	tickLog.info(`checkUser returned:\n${JSON.stringify(result2, null, 2)}`, true);
	expect(result2.payload).toEqual('Authenticated');
	let result3 = await checkUser(email, 'WRONG-PASSWORD');
	tickLog.info(`checkUser returned:\n${JSON.stringify(result3, null, 2)}`, true);
	expect(result3.payload).toEqual('passwordError');
	let result4 = await checkUser('NOT-EXISTING-USER@yopmail.com', 'WRONG-PASSWORD');
	tickLog.info(`checkUser returned:\n${JSON.stringify(result4, null, 2)}`, true);
	expect(result4.payload).toEqual('userNotFound');
});
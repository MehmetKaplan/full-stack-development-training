const tickLog = require('tick-log');
const { connect, runSQL } = require('tamed-pg');
const bcrypt = require('bcrypt');

const keys = {};

let poolName;

const init = (props) => new Promise(async (resolve, reject) => {
	try {
		keys.bcryptKeys = props.bcryptKeys;
		poolName = await connect(props.pgKeys);
		return resolve(true);
	} catch (error) /* istanbul ignore next */ {
		tickLog.error(`Function init failed. Error: ${JSON.stringify(error)}`, true);
		return reject(uiTexts.unknownError);
	}
});

async function checkUser(email, password) {
	const hash = await bcrypt.hash(password, keys.bcryptKeys.saltRounds);
	const result = await runSQL(poolName, 'select * from users where email = $1 and password = $2', [email, password]);
	tickLog.success(`checkUser returned rows:\n${JSON.stringify(result.rows, null, 2)}`, true);
}

const createUser = (email, password, name) => new Promise(async (resolve, reject) => {
	try {
		const hash = await bcrypt.hash(password, keys.bcryptKeys.saltRounds);
		const result = await runSQL(poolName, 'insert into users (email, name, password) values ($1, $2, $3) returning *', [email, name, hash]);
		tickLog.success(`createUser returned rows:\n${JSON.stringify(result.rows, null, 2)}`, true);
		return resolve({
			result: 'OK',
			payload: result.rows,
		});
	} catch (error) /* istanbul ignore next */ {
		return reject(error);
	}
});

module.exports = {
	init,
	checkUser,
	createUser
};

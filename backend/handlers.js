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

const checkUser = (email, password) => new Promise(async (resolve, reject) => {
	try {
		const result = await runSQL(poolName, 'select * from users where email = $1', [email]);
		if (result?.rows?.length === 0) {
			return resolve({
				result: 'ERROR',
				payload: 'userNotFound',
			});
		};
		let compareResult = await bcrypt.compare(password, result.rows[0].password);
		tickLog.success(`compareResult: ${compareResult}`);
		if (compareResult) {
			return resolve({
				result: 'OK',
				payload: 'Authenticated',
			});
		}
		return resolve({
			result: 'ERROR',
			payload: 'passwordError',
		});
	} catch (error) {
		return reject(error);
	}
});

const createUser = (emailFromRequest, password, name) => new Promise(async (resolve, reject) => {
	try {
		let email = emailFromRequest.toLowerCase().trim();
		const hash = await bcrypt.hash(password, keys.bcryptKeys.saltRounds);
		tickLog.error(`createUser hash: ${hash}, password: ${password}, saltRounds: ${keys.bcryptKeys.saltRounds}`, true);
		const checkUserExists = await runSQL(poolName, 'select * from users where email = $1', [email]);
		if (checkUserExists.rows.length > 0) {
			return resolve({
				result: 'ERROR',
				payload: "userAlreadyExists",
			});
		}
		const result = await runSQL(poolName, 'insert into users (email, name, password) values ($1, $2, $3) returning *', [email, name, hash]);
		result.rows[0].password = '***';
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

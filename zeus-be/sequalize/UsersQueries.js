import { getHashToken, getHashPassword } from '../utils/utils.js'

export const initUsersTable = (tableModel) => {
	tableModel.sync({ force: true })
	.then (() => {
		tableModel.bulkCreate([
			{
				username: 'alex',
				password: '60c6d277a8bd81de7fdde19201bf9c58a3df08f4', //
				authToken: '',
				authStatus: 'false',
				isAdmin: 'true'
			},
			{
				username: 'tolga',
				password: 'ec1c52f0363ae6ca086a66a4543f1ad6f5cb9af2', //
				authToken: '',
				authStatus: 'false',
				isAdmin: 'false'
			},
			{
				username: 'laura',
				password: '94745df4bd94de756ea5436584fec066fc7898d5', //
				authToken: '',
				authStatus: 'false',
				isAdmin: 'false'
			},
			{
				username: 'nedine',
				password: 'fed54842e59777ae3d324b18d9aea1f5efd7e26a', //
				authToken: '',
				authStatus: 'false',
				isAdmin: 'false'
			},									

		])
	})  
}

export const getUsers = async (tableModel, data) => {
	const hashPassword = getHashPassword(data.password)

	let result = await tableModel.findAll({ 
		attributes: ['id', 'username', 'authToken', 'authStatus', 'isAdmin', 'active']
	})
	if (result === null || result.length == 0) {
		console.log("No users? or no users found")
		result = {'status': 'false', 'msg': 'no users found'}
	}

    return result 
}

export const authenticate = async (tableModel, data) => {
	const hashPassword = getHashPassword(data.password)
	let result = await tableModel.findOne({ 
		where: { username: data.username, password: hashPassword , active: 'true'},
		attributes: ['id', 'username', 'authToken', 'authStatus', 'isAdmin']
	})
	if (result !== null)  
	{
		result.authToken = getHashToken(result.username)
		result.authStatus = 'true'
		//all user accounts isAdmin accounts for now....
		result.isAdmin = 'true'
    	console.log("Auth ok!!")
		result.update()

		// update user account with a authToken
		// authToken is required for every new user session APi call and checked if it exists 
		// and if timeStamp is older than X minutes. Which would require a new login.
		result.save()
	}
	else {
		console.log("Auth Failed!!")
		result = {'authStatus': 'false'}
	}
    return result 
}

export const addUser = async (tableModel, data) => {
	const hashPassword = getHashPassword(data.password)

	let result = await tableModel.create({ 
		username: data.username, 
		password: hashPassword ,
		authToken: '', 
		authStatus: 'false', 
		isAdmin: data.isAdmin, 
	})

	if (result === null || result.length == 0) {
		console.log(`Something went wrong with adding new user: ${data.username}`)
		return {'status': 'false', 'msg': 'Something went wrong with adding new user: ' + data.username}
	}
	//just for test purposes.. Uncomment below if this will be used in the future...
	//else return {'status': 'true', 'msg': 'User: ' + data.username + ' successfuly created!!'}
	else return result
}

export const deleteUserById = async (tableModel, data) => {
	let result = await tableModel.destroy({ where: {id: data.id}})
	//console.log(`delete result is: ${result} !!`)

	if (result !== 1) {
		console.log("Failed to delete user with id !!", data.id)
		return {'status': 'false', 'msg': 'failed to delete user with id: ' + data.id}
	}
	else return {'status': 'true', 'msg': 'user with id: ' + data.id + ' deleted!!'}

}

export const deleteUserByName = async (tableModel, data) => {
	let result = await tableModel.destroy({ where: {username: data.username}})
	//console.log(`delete result is: ${result} !!`)

	if (result !== 1) {
		console.log("Failed to delete user with name !!", data.username )
		return {'status': 'false', 'msg': 'failed to delete user: ' + data.username}
	}
	else return {'status': 'true', 'msg': 'user: ' + data.username + ' deleted!!'}
}
export const initUserSessionsTable = (tableModel) => {
	tableModel.sync({alter: true}) 
}

export const getUserSessions = async (tableModel, data) => {
	let result = await tableModel.findAll({ 
		where: { uid: data.uid},
		attributes: ['id', 'uid', 'from', 'to']
	})
	if (result === null || result.length == 0) {
		console.log("no user sessions found")
		result = {'status': 'false', 'msg': 'no user sessions found'}
	}

    return result 
}

export const addUserSession = async (tableModel, data) => {	
	const newUserSession = await tableModel.create(
		{
			'uid': data.uid,
			'email': data.email,
			'authToken': '',
            'displayName': data.displayName,
            'photoUrl': data.photoUrl,
            'firstName': data.firstName,
            'lastName': data.lastName,
		}
	)
	console.log("newUserSession's auto-generated ID:", newUserSession.id);
	console.log('newUserSession is: ', JSON.stringify(newUserSession))
	//send back a new updated userSessions list to requester
	let result = await tableModel.findAll({ where: { uid: data.uid } })
	if (result === null || result.length == 0)  
	{
		console.log("Failed to get updated user X's userSessions!!")
		result = {'status': 'false', 'msg': 'failed to retrieve or no userSessions found for uid'}
	}

    return result 
}
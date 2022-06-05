export const initUserHistoryTable = (tableModel) => {
	tableModel.sync({alter: true}) 
}

export const addUserHistory = async (tableModel, data) => {	
	const newUserHistory = await tableModel.create(
		{
			'uid': data.uid,
			'from': data.from,
			'to': data.to,
		}
	)
	console.log("newUserHistory's auto-generated ID:", newUserHistory.id);
	console.log('newUserHistory is: ', JSON.stringify(newUserHistory))
	//send back a new updated newUserHistory list to requester
	let result = await tableModel.findAll({ where: { uid: data.uid } })
	if (result === null || result.length == 0)  
	{
		console.log("Failed to get updated user X's userSessions!!")
		result = {'status': 'false', 'msg': 'failed to retrieve or no userSessions found for uid'}
	}

    return result 
}

export const getUserHistory = async (tableModel, data) => {
	let result = await tableModel.findAll({ 
		where: { uid: data.uid},
		attributes: ['id', 'uid', 'from', 'to']
	})
	if (result === null || result.length == 0) {
		console.log("New user? or no user history found")
		result = {'status': 'false', 'msg': 'no userHistory found'}
	}

    return result 
}
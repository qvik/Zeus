import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { Sequelize } from "sequelize"
//utils
import { getHashToken, getHashPassword } from './utils/utils.js'
//db models
import { dbTblUsers, dbTblUserHistory, dbTblUserSessions } from './sequalize/Models.js'

//db table specifics
import {initUsersTable, authenticate, getUsers, addUser, deleteUserById, deleteUserByName } from './sequalize/UsersQueries.js'
import { initUserHistoryTable, getUserHistory } from './sequalize/UserHistoryQueries.js';
import { initUserSessionsTable, getUserSessions, addUserSession } from './sequalize/UserSessions.js';

const app = express()
app.use(cors())

dotenv.config()
const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_URL, BE_PORT, BE_HOST } = process.env
console.log(`POSTGRES_URL is: ${POSTGRES_URL}`)

const port = BE_PORT
const serverIP = BE_HOST

// configure bodyParser for URL data and POST/PUT/DELETE request data
//Parse request POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//init sequelize DB connection
const sequelize = new Sequelize(POSTGRES_URL, {
	logging: console.log
})

sequelize.authenticate()
.then(() => {
	console.log("Success!")
  })
  .catch((err) => {
	console.log(err)
  });

//db table models init (read in the table models)
var Users = dbTblUsers(sequelize)
var UserHistory = dbTblUserHistory(sequelize)
var UserSessions = dbTblUserSessions(sequelize)

//Create tables if not exist 
//this needs to be an active call instead of automatic or done manually.. 
//Since this will recreate the tables each time the express server starts.. Good for testing
initUsersTable(Users)
initUserHistoryTable(UserHistory)
initUserSessionsTable(UserSessions)

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next();
});

app.post('/zeus/getHashPassword', (req, res) => {
	//console.log("received req.body is: ", req.body.password);
	res.send(getHashPassword(req.body.password))
})

app.get('/zeus/getUsers', async function (req, res) {
	const usersList = await getUsers(Users)
	res.send({'usersList': usersList})
})

app.post('/zeus/addUser', async function (req, res) {
	console.log("received req.body is: ", req.body);
	const result = await addUser(Users, req.body)
	res.send({'result': result})
})

app.post('/zeus/deleteUserById', async function (req, res) {
	//console.log("received req.body is: ", req.body);
	const result = await deleteUserById(Users, req.body)
	res.send({'result': result})
})

app.post('/zeus/deleteUserByname', async function (req, res) {
	const result = await deleteUserByName(Users, req.body)
	res.send({'result': result})
})

app.post('/zeus/getUserHistory', async function (req, res) {
	const userHistoryList = await getUserHistory(req.body)

	res.send({'userHistory': userHistoryList})
})

app.post('/zeus/authenticate', async function (req, res) {
	//console.log("received req.body is: ", req.body);
	const result = await authenticate(Users, req.body)
	res.send(result)
})

app.listen(port, serverIP, () => console.log(`express server PORT: ${port}, IP: ${serverIP}!`))




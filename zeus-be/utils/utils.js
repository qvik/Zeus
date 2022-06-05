import crypto from 'crypto'

export const getDateString = () => {
    let current = new Date()
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate()
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds()
    let dateTime = cDate + ' ' + cTime
    return dateTime
}

export const getHashToken = (username) => {
    let current = new Date()
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate()
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds()
    let combinedString = cDate + ' ' + cTime + username
    console.log(combinedString)
    const hashToken = crypto.createHash('sha1').update(combinedString).digest('hex')
    console.log('hashToken is: ', hashToken)
    return hashToken
}

export const getHashPassword = (password) => {
    const hashPassword = crypto.createHash('sha1').update(password).digest('hex')
    console.log('hashPassword is: ', hashPassword)
    return hashPassword
}

import { DataTypes } from "sequelize"

export const dbTblUsers = (sequalizeObj) => {
  return sequalizeObj.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },  
    username: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    authToken: {
      type: DataTypes.STRING
    },
    authStatus: {
      type: DataTypes.ENUM,
      values: ['true', 'false'],
      defaultValue: 'false'    
    },
    isAdmin: {
      type: DataTypes.ENUM,
      values: ['true', 'false'],
      defaultValue: 'false'    
    },    
    active: {
      type: DataTypes.ENUM,
      values: ['true', 'false'],
      defaultValue: 'true'
    }  
  }, 
  {
    freezeTableName: true
  })
}

export const dbTblUserSessions = (sequalizeObj) => {
  return sequalizeObj.define('userSessions', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },  
    uid: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    authToken: {
      type: DataTypes.STRING
    },
    displayName: {
      type: DataTypes.STRING
    },
    photoUrl: {
      type: DataTypes.STRING   
    },    
    firstName: {
      type: DataTypes.STRING   
    }, 
    lastName: {
      type: DataTypes.STRING   
    },     
  }, 
  {
    freezeTableName: true
  })
}

export const dbTblUserHistory = (sequalizeObj) => {
  return sequalizeObj.define('userHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uid: {
      type: DataTypes.STRING
    },       
    from: {
      type: DataTypes.STRING
    },
    to: {
      type: DataTypes.STRING
    },   
  }, 
  {
    freezeTableName: true
  })
}






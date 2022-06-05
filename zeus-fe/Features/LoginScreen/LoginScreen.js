import * as React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import axios from 'axios'
import { useDispatch} from 'react-redux';
import {updateLogin } from '../Redux/LoginSlice';
import { useState} from 'react';
import { updateEnv } from '../Redux/EnvSlice';

const authenticate = (username, password, dispatch) => {
  console.log("username is: ", username)
  axios
      /// authenticate
      .post('http://localhost:8080/' + `zeus/authenticate`, {"username": username, "password": password})
      .then(res => {
          dispatch(updateLogin(res.data))
      })
}   

export const LoginScreen = () => {
  const dispatch = useDispatch();

  let [username, setUsername] = useState("firstName")
  let [password, setPassword] = useState("password")    

    return (
      <View style={styles.layout}>
        <Text style={styles.title}>LoginScreen</Text>
        <TextInput style={{backgroundColor: 'grey', color: 'white', height: 30, marginBottom: 1}}
          placeholder={username}
          value={username}
          onChangeText={(e) => setUsername(e)}
        />
        <TextInput style={{backgroundColor: 'grey', color: 'white', height: 30, marginBottom: 20}}
          placeholder={username}
          value={password}
          secureTextEntry
          onChangeText={(e) => setPassword(e)}
        />      
        <Button title="login" onPress={() => authenticate(username, password, dispatch)} />
      </View>
    );
  };

  const styles = StyleSheet.create({
    layout: {
      flex: 1,
      justifyContent: 'center',
      padding: 8,
      width: "50%",
      marginLeft: "auto",
      marginRight: "auto",
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
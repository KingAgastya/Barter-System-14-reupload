import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Alert, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import db from '../config';
import * as firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize'

export default class WelcomeScreen extends Component {
  constructor(){
    super()
    this.state={
      emailId : '',
      password: '',
      confirmPassword : '',
      name : '',
      mobile : '',
      address : '',
      age : '',
      isModalVisible : 'false',
      currencyCode : ''
    }
  }

  showModal =()=>{
    return(
      <Modal animationType = "fade" 
      transparent = {true}
      visible = {this.state.isModalVisible}>

        <View style = {styles.modalContainer}>
          <ScrollView style = {{width : "100%"}}>
              <KeyboardAvoidingView style = {styles.keyboardAvoidingView}>
                  <Text style = {styles.modalTitle}>CREATE YOUR ACCOUNT</Text>

                  <TextInput style = {styles.formTextInput}
                  placeholder = {"name"}
                  maxLength = {25}
                  onChangeText ={(text) =>{
                    this.setState({
                      name : text
                    })
                  }}/>

                  <TextInput style = {styles.formTextInput}
                  placeholder = {"mobile"}
                  keyboardType = {"numeric"}
                  maxLength = {10}
                  onChangeText ={(text) =>{
                    this.setState({
                      mobile : text
                    })
                  }}/>

                  <TextInput style = {styles.formTextInput}
                  placeholder = {"address"}
                  multiline = {true}
                  onChangeText ={(text) =>{
                    this.setState({
                      address : text
                    })
                  }}/>

                  <TextInput style = {styles.formTextInput}
                  placeholder = {"age"}
                  keyboardType = {"numeric"}
                  maxLength = {2}
                  onChangeText ={(text) =>{
                    this.setState({
                      age : text
                    })
                  }}/>

                  <TextInput style = {styles.formTextInput}
                  placeholder = {"Currency Code"}
                  keyboardType = {"numeric"}
                  maxLength = {9}
                  onChangeText ={(text) =>{
                    this.setState({
                      currencyCode : text
                    })
                  }}/>

                  <TextInput style = {styles.formTextInput}
                  placeholder = {"emailId"}
                  keyboardType = {"email-address"}
                  onChangeText ={(text) =>{
                    this.setState({
                      emailId : text
                    })
                  }}/>

                <TextInput style = {styles.formTextInput}
                  placeholder = {"Password"}
                  secureTextEntry = {true}
                  onChangeText ={(text) =>{
                    this.setState({
                      password : text
                    })
                  }}/>  

                  <TextInput style = {styles.formTextInput}
                  placeholder = {"Confirm Password"}
                  secureTextEntry = {true}
                  onChangeText ={(text) =>{
                    this.setState({
                      confirmPassword : text
                    })
                  }}/>  

                  <View style = {styles.modalBackButton}>
                    <TouchableOpacity style = {styles.registerButton}
                    onPress ={() => {
                      this.userSignUp(this.state.emailId, this.state.password, this.state.confirmPassword)
                    }}>
                      <Text style = {styles.registerButtonText}>REGISTER</Text>
                    </TouchableOpacity>
                  </View>
                  <View style = {styles.modalBackButton}>
                    <TouchableOpacity style = {styles.cancelButton}
                    onPress ={() =>{
                      this.setState({
                        "isModalVisible" : false
                      })
                    }}>
                      <Text style = {{color : "#ab1342"}}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
              </KeyboardAvoidingView>
          </ScrollView>
        </View>

      </Modal>
    )
  }

  userLogin = (emailId, password)=>{
    firebase.auth().signInWithEmailAndPassword(emailId, password)
    .then(()=>{
      return Alert.alert("Successfully Login")
    })
    .catch((error)=> {
      var errorCode = error.code;
      var errorMessage = error.message;
      return Alert.alert(errorMessage)
    })
  }

  userSignUp = (emailId, password, confirmPassword) =>{
    if(password !== confirmPassword){
      return Alert.alert("Password is wrong")
    }
    else{
      firebase.auth().createUserWithEmailAndPassword(emailId, password)
      .then(()=>{
        db.collection("user").add({
          name : this.state.name,
          mobile : this.state.mobile,
          address : this.state.address,
          age : this.state.age,
          emailId : this.state.emailId,
          isBookRequestActive : false
        })
        return Alert.alert("User Added Successfully")
        [{text : "Ok", onPress : ()=>this.setState({
          "isModalVisible" : false
        })}]
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage)
      });
    }
  }


  render(){
    return(
      <View style={styles.container}>
        <View style = {{justifyContent : "center", alignItems : "center"}}>
          {this.showModal()}
        </View>
        <View style={styles.buttonContainer}>
          <TextInput
          style={styles.loginBox}
          placeholder="Email Id"
          placeholderTextColor = "#ffff"
          keyboardType ='email-address'
          onChangeText={(text)=>{
            this.setState({
              emailId: text
            })
          }}
        />

        <TextInput
          style={styles.loginBox}
          secureTextEntry = {true}
          placeholder="password"
          placeholderTextColor = "#ffff"
          onChangeText={(text)=>{
            this.setState({
              password: text
            })
          }}
        />
        <TouchableOpacity
          style={[styles.button,{marginBottom : RFValue(20), marginTop : RFValue(20)}]}
          onPress = {()=>{this.userLogin(this.state.emailId, this.state.password)}}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={()=>{this.userSignUp(this.state.emailId, this.state.password)}}
            >
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#F8BE85'
  },
  profileContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  title :{
    fontSize : RFValue(65),
    fontWeight:'300',
    paddingBottom : RFValue(30),
    color : '#ff3d00'
  },
  loginBox:{
    width: "300%",
    height: RFValue(40),
    borderBottomWidth: 1.5,
    borderColor : '#ff8a65',
    fontSize: RFValue(20),
    margin : RFValue(10),
    paddingLeft : RFValue(10)
  },
  button:{
    width: "300%",
    height : RFValue(50),
    justifyContent : 'center',
    alignItems : 'center',
    borderRadius : 25,
    backgroundColor : "#ff9800",
    shadowColor :  "#000",
    shadowOffset : {
       width : 0,
       height : 8,
    },
    shadowOpacity : 0.30,
    shadowRadius : 10.32,
    elevation : 16,
  },
  buttonText :{
    color :'#ffff',
    fontWeight :'200',
    fontSize : RFValue(20)
  },
  buttonContainer :{
    flex : 1,
    alignItems :'center'
  },
  modalContainer : {
    flex : 1,
    alignItems : 'center',
    alignSelf : 'center'
  },
  keyboardAvoidingView : {
    flex : 1,
  },
  formTextInput : {
    color : "black",
    fontSize : RFValue(15)
  },
  modalBackButton : {
    backgroundColor : "grey",
    justifyContent : 'center',
    width : "50%",
    height : RFValue(20)
  },
  registerButton : {
    backgroundColor : "grey",
    justifyContent : 'center',
    width : "50%",
    height : RFValue(20)
  },
  registerButtonText : {
    color : "#000000",
    fontSize : RFValue(15)
  },
  cancelButton : {
    backgroundColor : "#ff0000"
  }
})
import React, {Component} from 'react'
import {View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Alert, TextInput} from 'react-native'
import db from '../config'
import MyHeader from '../components/MyHeader' 
import firebase from 'firebase'
import {RFValue} from 'react-native-responsive-fontsize'

export default class ExchangeScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            userName : firebase.auth().currentUser.email,
            itemName : '',
            description : '',
            currencyCode : '',
            requestId : '',
            requestItemName : '',
            docId : '',
            itemStatus : '',
            userDocId : '',
            isItemRequestActive : '',
            reasonToRequest : '',
            barterId : ''
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }

    getItemRequest =()=>{
        var itemRequest = db.collection("requested_items").where("user_id", '==', this.state.userId).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                if(doc.data().item_status !== "received"){
                    this.setState({
                        requestId : doc.data().request_id,
                        requestItemName : doc.data().item_name,
                        itemStatus : doc.data().item_status,
                        docId : docId
                    })
                }
            })
        })
    }

    getIsItemRequestActive(){
        db.collection("user").where("email_id", "==", this.state.userId)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.setState({
                    isItemRequestActive : doc.data().isItemRequestActive,
                    userDocId : doc.id
                })
            })
        })
    }

    getData(){
        fetch("http://data.fixer.io/api/latest?access_key=896bfd0f304daacabf304a3c378f5123")
        .then(response => {
            return response.json()
        })
        .then(responseData => {
            var currencyCode = this.state.currencyCode
            var currency = responseData.rates.INR
            var value = 69/currency
        })
    }
    

    sendNotification =()=>{
        db.collection("user").where("email_id", "==", this.state.userId).get()
        .then((snapshot) =>{
            snapshot.forEach((doc) => {
            var name = doc.data().name
            db.collection("all_notifications").where("request_id", "==", this.state.requestId).get()
                .then((snapshot) =>{
                snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id
                var itemName = doc.data().item_name
                db.collection("all_notifications").add({
                    "targeted_user_id" : donorId,
                    "message" : name + " " +  "has received your item" + itemName, 
                    "notification_status" : "unread",
                    "item_name" : itemName
                })
            })
        })
        })
    })}

    updateItemRequestStatus=()=>{
        db.collection("requested_items").doc(this.state.docId).update({
            item_status : "received"
        })
        db.collection("user").where("email_id", "==", this.state.userId).get()
        .then((snapshot) =>{
            snapshot.forEach((doc) => {
                db.collection("user").doc(doc.id).update({
                    isItemRequestActive : false
                })
            })
        })
    }

    addRequest =async(itemName, reasonToRequest)=>{
        var userId = this.state.userId
        var randomRequestId = this.createUniqueId()
        db.collection("requested_items").add({
            "item_name" : itemName,
            "reason_to_request" : reasonToRequest,
            "request_id" : randomRequestId,
            "user_id" : userId,
            "item_status" : "requested",
            "date" : firebase.firestore.FieldValue.serverTimestamp()
        })
        await this.getitemRequest()
        db.collection("user").where("email_id", "==", userId).get().then()
        .then((snapshot) => {
        snapshot.forEach((doc) =>{db.collection("user").doc(doc.id).update({
            isItemRequestActive : true
        })})

        
        this.setState({
            itemName : "",
            reasonToRequest : "",
            requestId : randomRequestId
        })

        return Alert.alert("Request Created")
    })
    }

    receivedItems =(itemName)=>{
        var userId = this.state.userName
        var barterId = this.state.barterId
        db.collection("received_items").add({
            "user_id" : userId,
            "item_name" : itemName,
            "barter_id" : barterId,
            "item_status" : "received"
        })
    }

    componentDidMount(){
        this.getIsItemRequestActive()
        this.getData()
        this.getItemRequest()
    }

    render(){
        if(this.state.isItemRequestActive === true){
            return(
                <View style = {{flex : 1, justifyContent : 'center'}}>
                    <View style = {{justifyContent : "center", alignItems : 'center', borderColor : "#235e13", borderWidth : 2, padding : 10, margin : 10}}>
                        <Text>Item Name</Text>
                        <Text>{this.state.requestItemName}</Text>
                    </View>
                    <View style = {{justifyContent : "center", alignItems : 'center', borderColor : "#235e13", borderWidth : 2, padding : 10, margin : 10}}>
                        <Text>Item Status</Text>
                        <Text>{this.state.item_status}</Text>
                    </View>
                    <TouchableOpacity style = {{backgroundColor : "#124eac", borderColor : "#333BCD", alignItems : "center", alignSelf : "center", height : 30, borderWidth : 1}}
                    onPress ={() =>{
                        this.sendNotification()
                        this.updateitemRequestStatus()
                        this.receivedItems(this.state.requestItemName)
                    }}>
                        <Text>I have Received The item</Text>
                    </TouchableOpacity>

                </View>
            )
        }
        else{
            return(
                <View style = {styles.container}>
                    <MyHeader title = "Request An Item"/>
                    <KeyboardAvoidingView style = {styles.keyBoardStyle}>

                        <TextInput style = {styles.formTextInput}
                        placeholder = {"Enter Item Name"}
                        onChangeText = {(text) => {
                            this.setState({
                                itemName : text
                            })
                        }}
                        value = {this.state.itemName}/>

                        <TextInput style = {[styles.formTextInput, {height : 300}]}
                        multiline
                        numberOfLines = {8}
                        placeholder = {"Reason for requesting the item"}
                        onChangeText = {(text) => {
                            this.setState({
                                description : text
                            })
                        }}
                        value = {this.state.description}/>

                        <TouchableOpacity style = {styles.button}
                        onPress ={() =>{
                            this.addItem(this.state.itemName, this.state.description)
                        }}>
                            <Text>Add Item</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            )
        }
    }
}

styles = StyleSheet.create({
    container : {
        flex : 1
    },
    keyBoardStyle : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center"
    },
    formTextInput : {
        width : "60%",
        height : RFValue(50),
        marginTop : RFValue(20),
        borderRadius : 15,
        borderWidth : 4,
        padding : RFValue(10),
        borderColor : "red"
    },
    button : {
        width : "50%",
        height : RFValue(20),
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : "#696969",
        shadowColor : 0,
        shadowOffset : {
            width : 5,
            height : 10
        }
    }
})
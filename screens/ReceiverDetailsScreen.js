import React from 'react'
import {Text, StyleSheet, View, TextInput, TouchableOpacity, Alert} from 'react-native'
import firebase from 'firebase'
import db from '../config'
import {Card, Header, Icon} from 'react-native-elements'
import {RFValue} from 'react-native-responsive-fontsize'

export default class ReceiverDetailsScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            userId : firebase.auth().currentUser.email,
            barterId : this.props.navigation.getParam("details")["user_id"],
            itemName : this.props.navigation.getParam("details")["item_name"],
            reasonForBarter : this.props.navigation.getParam("details")["reason_for_barter"],
            barterId : this.props.navigation.getParam("details")["barter_id"],
            receiverName : "",
            receiverMobile : "",
            receiverAge : "",
            receiverAddress : "",
            receiverRequestDocId : ""
        }
    }

    getReceiverDetails(){
        db.collection("user").where("email_id", "===", this.state.recieverId).get()
        .then(snapshot =>{
            snapshot.forEach(doc => {
                this.setState({
                    receiverName : doc.data().name,
                    receiverAddress : doc.data().address,
                    receiverAge : doc.data().age,
                    receiverMobile : doc.data().mobile,
                })
            })
        })
    }

    addNotifications =()=>{
        var message = this.state.userName + "has shown interest in donating a book"
        db.collection("all_notifications").add({
            "targeted_user_id" : this.state.recieverId,
            "donor_id" : this.state.userId,
            "barter_id" : this.state.barterId,
            "book_name" : this.state.bookName,
            "date" : firebase.firestore.FieldValue.serverTimestamp(),
            "notification_status" : "unread",
            "message" : message
        })
    }

    updateBookStatus =()=>{
        db.collection("all_donations").add({
            book_name : this.state.bookName,
            barter_id : this.state.barterId,
            requested_by : this.state.receiverName,
            donor_id : this.state.userId,
            request_status : "Donor Interested"
        })
    }

    render(){
        return(
            <View style = {styles.container}>
                <View style = {{flex : 0.1}}> 
                    <Header leftComponent = {<Icon Name = "arrow-left" type = "feather" color = "#00ffff" onPress ={()=>{
                    this.props.navigation.goBack()}}/>}
                    centerComponent = {{text : "Barter Items", style : {color : "blue", fontSize : RFValue(30), fontWeight : 'bold'}}}
                    backgroundColor = "#ffff00"/>
                </View>
                <View style = {{flex : 0.4}}>
                    <Card title = {"Item Info"} titleStyle = {{fontSize : RFValue(30)}}>
                        <Card><Text style = {{fontWeight : "bold"}}>Name : {this.state.itemName}</Text></Card>
                        <Card><Text style = {{fontWeight : 'bold'}}>Reason : {this.state.reason_for_barter}</Text></Card>
                    </Card>
                </View>
                <View style = {{flex : 0.4}}>
                    <Card title = {"Receiver Info"} titleStyle = {{fontSize : RFValue(30)}}>
                        <Card><Text style = {{fontWeight : "bold"}}>Name : {this.state.receiverName}</Text></Card>
                        <Card><Text style = {{fontWeight : 'bold'}}>Mobile : {this.state.receiverMobile}</Text></Card>
                        <Card><Text style = {{fontWeight : 'bold'}}>Address : {this.state.receiverAddress}</Text></Card>
                        <Card><Text style = {{fontWeight : 'bold'}}>Age : {this.state.receiverAge}</Text></Card>
                    </Card>
                </View>

                <View style = {styles.buttonContainer}>
                    {this.state.recieverId !== this.state.userId?(
                    <TouchableOpacity style = {styles.button}
                    onPress ={() =>{
                        this.updateBookStatus()
                        this.addNotifications()
                        this.props.navigation.navigate("MyBarters")
                    }}
                    >
                        <Text style = {style.buttonText}>I want to barter</Text>
                    </TouchableOpacity>) : null}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    }
})
import React from 'react'
import {View, StyleSheet, Text, FlatList} from 'react-native'
import {ListItem} from 'react-native-elements'
import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'
import {RFValue} from 'react-native-responsive-fontsize'

export default class MyReceivedItemsScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            userId : firebase.auth().currentUser.email,
            receivedItems : []
        }
        this.requestRef = null
    }

    componentDidMount(){
        this.getReceivedItemsList()
    }

    componentWillUnmount(){
        this.requestRef()
    }

    getReceivedItemsList =()=>{
        this.requestRef = db.collection("requested_items").where("user_id", "==", this.state.userId).where("item_status", "==", "received")
        .onSnapshot((snapshot)=>{
            var receivedItems = snapshot.docs.map((doc) => decodeURIComponent.data())
            this.setState({
                "receivedItems" : receivedItems
            })
        })
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({item, i}) => {
        return(
            <ListItem
            key = {i}
            title = {item.book_name}
            subtitle = "Item has been received"
            bottomDivider/>
        )
    }

    render(){
        return(
            <View style = {styles.container}>
            <MyHeader title = "Items Received"
            navigation = {this.props.navigation}/>
            {
            this.state.receivedItems.length !== 0?(
                <FlatList
                    keyExtractor = {this.keyExtractor}
                    data = {this.state.receivedItems}
                    renderItem = {this.renderItem}/>
                )   
                : (
                    <Text style = {{fontSize : RFValue(25), textAlign : 'center', fontWeight : 'bold'}}>You Have Not Received Any Items</Text>
                )
            }
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    heading : {
        fontSize : RFValue(45),
        textAlign : 'center',
        justifyContent : 'center',
        alignSelf : 'center',
        padding : RFValue(1),
        margin : RFValue(20)
    }
})
import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'
import {RFValue} from 'react-native-responsive-fontsize'

export default class MyBartersScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
      userId : firebase.auth().currentUser.email,
      allBarters : []
    }
    this.requestRef= null
  }

  sendNotifications =(itemDetails, barter_status)=>{
    var barterId = itemDetails.barter_id
    var donorId = itemDetails.donor_id
    db.collection("all_notifications").where("barter_id", "==", barterId).where("donor_id", "==", donorId).get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        var message = ""
        if(barter_status === "Item Sent"){
          message = this.state.donorName + "sent you an item for barter"
        }
        else{
          message = this.state.donorName + "has shown interest in bartering with you"
        }
        db.collection("all_notifications").doc(doc.id).update({
          "message" : message,
          "notification_status" : "Unread",
          date : firebase.firestore.FieldValue.serverTimestamp()
        })
      })
    })
  }

  sendItem =(itemDetails)=>{
    if(itemDetails.request_status === "Item Sent"){
      var barterStatus = "Donor Interested"
      db.collection("all_donations").doc(itemDetails.doc_id).update({
        "barter_status" : "Donor Interested"
      })
      this.sendNotifications(itemDetails, barterStatus)
    }
    else{
      var barterStatus = "Item Sent"
      db.collection("all_donations").doc(itemDetails.doc_id).update({
        "barter_status" : "Item Sent"
      })
      this.sendNotifications(itemDetails, barterStatus)
    }
  }

   getAllBarters =()=>{
     this.requestRef = db.collection("all_barters").where("donor_id" ,'==', this.state.userId)
     .onSnapshot((snapshot)=>{
       var allBarters = snapshot.docs.map(document => document.data());
       this.setState({
         allBarters : allBarters,
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
      key={i}
      title={item.book_name}
      subtitle={"Bartered By : " + item.requested_by +"\nStatus : " + item.barter_status}
      leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
      titleStyle={{ color: 'black', fontWeight: 'bold' }}
      rightElement={
          <TouchableOpacity style={styles.button} 
          onPress ={() =>{
            this.sendItem(item)
          }}>
            <Text style={{color:'#ffff'}}>Send Item</Text>
          </TouchableOpacity>
        }
      bottomDivider
    />
  )


   componentDidMount(){
     this.getAllBarters()
    }

   componentWillUnmount(){
     this.requestRef();
    }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Barters"/>
         <View style={{flex:1}}>
          {
            this.state.allBarters.length === 0
            ?(
              <View style={styles.subtitle}>
                <Text style={{ fontSize: 20}}>List of all barters</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allBarters}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:"100%",
    height:RFValue(30),
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: RFValue(20),
    justifyContent:'center',
    alignItems:'center'
  }
})
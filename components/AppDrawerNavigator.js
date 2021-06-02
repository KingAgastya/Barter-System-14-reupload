import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import MyBartersScreen from '../screens/MyBartersScreen';
import {Icon} from 'react-native-elements'
import SettingsScreen from '../screens/SettingsScreen';
import MyReceivedItemsScreen from '../screens/MyReceivedItemsScreen'

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator,
    navigationOptions : {
      drawerIcon : <Icon name = "Home" type = 'font-awesome'/>,
      drawerLabel : "Home"
    }
  },
  MyDonations : {
    screen : MyBartersScreen,
    navigationOptions : {
      drawerIcon : <Icon name = "Item" type = 'font-awesome'/>,
      drawerLabel : "My Donations"
    }
  },
  MyReceivedItems : {
    screen : MyReceivedItemsScreen,
    navigationOptions : {
      drawerIcon : <Icon name = "Gift" type = 'font-awesome'/>,
      drawerLabel : "My Received Items"
    }
  },
  Settings : {
    screen : SettingsScreen,
    navigationOptions : {
      drawerIcon : <Icon name = "Settings" type = 'font-awesome'/>,
      drawerLabel : "Settings"
    }
  }
},
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  }
)
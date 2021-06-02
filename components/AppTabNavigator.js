import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ExchangeScreen from '../screens/ExchangeScreen';
import HomeScreen from '../screens/HomeScreen'
import {createBottomTabNavigator} from 'react-navigation-tabs'

export const AppTabNavigator = createBottomTabNavigator({
    DonateItems : {
        screens : DonateScreen,
        navigationOptions : {tabBarLabel : "Donate Items"}
    },
    RequestItems : {
        screens : RequestScreen,
        navigationOptions : {tabBarLabel : "Request Items"}
    },
})
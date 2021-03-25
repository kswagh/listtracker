/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import 'react-native-gesture-handler';
 import React from 'react';
 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
 import { createDrawerNavigator } from '@react-navigation/drawer';
 import { View, Text, StatusBar } from 'react-native';
 import List from './app/components/List'
 import ListDetails from './app/components/ListDetails'
 import Stopwatch from './app/components/Stopwatch'
 
 
 class SplashScreen extends React.Component {
   constructor(props) {
     super(props)
   }
 
   componentDidMount() {
     setTimeout(() => {
       this.props.navigation.navigate("List")
     }, 2000);
   }
 
   render() {
     return (
       <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
         <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={true} />
         <Text style={{ fontSize: 30, color: '#ffffff', fontFamily: 'DancingScript-Medium' }}>List</Text>
         <Text style={{ fontSize: 30, color: '#ffffff', fontFamily: 'DancingScript-Medium' }}>Tracker</Text>
       </View>
     )
   }
 }
 
 
 const ListStackNavigator = createStackNavigator();
 
 const ListStack = () => {
   return (
     <ListStackNavigator.Navigator>
        <ListStackNavigator.Screen name="SplashScreen" component={SplashScreen}
         options={{
           headerShown: false,
           cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
         }}
       />
       <ListStackNavigator.Screen name="List" component={List}
         options={{
           headerShown: false,
           cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
         }}
       />
       <ListStackNavigator.Screen name="ListDetails" component={ListDetails}
         options={{
           headerShown: false,
           cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
         }}
       />
     </ListStackNavigator.Navigator>
   );
 }
 
 const StopwatchStackNavigator = createStackNavigator();
 
 const StopwatchStack = () => {
   return (
     <StopwatchStackNavigator.Navigator>
        <StopwatchStackNavigator.Screen name="Stopwatch" component={Stopwatch}
         options={{
           headerShown: false,
           cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
         }}
       />
     </StopwatchStackNavigator.Navigator>
   );
 }
 
 
 const Drawer = createDrawerNavigator();
 
 function App() {
   return (
     <NavigationContainer>
       <Drawer.Navigator drawerContentOptions={{activeBackgroundColor: '#000000', activeTintColor: '#ffffff'}} drawerType={'slide'} >
         <Drawer.Screen name="Lists" component={ListStack} />
         <Drawer.Screen name="Stopwatch" component={StopwatchStack} />
       </Drawer.Navigator>
     </NavigationContainer >
   );
 }
 
 
 export default App;
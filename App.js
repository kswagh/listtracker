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
import { createStackNavigator } from '@react-navigation/stack';
import {
  View,
  Text,
} from 'react-native';
import HomeScreen from './app/components/HomeScreen'


class SplashScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate("HomeScreen")
    }, 2000);
  }

  render() {
    return(
      <View style={{flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 30, color: '#ffffff', fontFamily: 'DancingScript-Medium'}}>Happy</Text>
        <Text style={{fontSize: 30, color: '#ffffff', fontFamily: 'DancingScript-Medium'}}>Birthday</Text>
      </View>
    )
  }
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={SplashScreen}  options={{headerShown: false}}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
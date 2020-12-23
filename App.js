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
import { View, Text, StatusBar } from 'react-native';
import List from './app/components/List'
import ListDetails from './app/components/ListDetails'


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

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="List" component={List}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }} />
        <Stack.Screen name="ListDetails" component={ListDetails}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}

export default App;
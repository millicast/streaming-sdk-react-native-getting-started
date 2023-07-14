/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// import React from 'react';
// import type {Node} from 'react';
// import ReactNative, {
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

import * as React from 'react';
import { Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Viewer from './Viewer'

import myStyles from './styles.js'

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={myStyles.screenContainer}>
      <Text style={myStyles.title}>SAMPLE APP</Text>
      <TouchableOpacity hasTVPreferredFocus tvParallaxProperties={{ magnification: 1.2 }} onPress={() => navigation.navigate('Subscriber App')} style={myStyles.buttonDesign}>
        <Text style={myStyles.buttonText}>SUBSCRIBER</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// function HomeScreen({ navigation }) {
//   return (
//     <SafeAreaView style={myStyles.screenContainer}>
//       <Text style={myStyles.title}>SAMPLE APP</Text>
//       {!utils.isTV() ?
//         <TouchableOpacity onPress={() => navigation.navigate('Publisher App')} style={myStyles.buttonDesign}>
//           <Text style={myStyles.buttonText}>PUBLISHER</Text>
//         </TouchableOpacity>
//         : null
//       }
//       <TouchableOpacity onPress={() => navigation.navigate('Subscriber App')} style={myStyles.buttonDesign}>
//         <Text style={myStyles.buttonText}>SUBSCRIBER</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

const Stack = createNativeStackNavigator();

function App() {
  return (
    
    <NavigationContainer style={myStyles.screenContainer}>
      <Stack.Navigator style={myStyles.screenContainer}>
        <Stack.Screen name="Millicast SDK Demo" component={HomeScreen} />
        <Stack.Screen name="Subscriber App" component={Viewer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// const Section = ({children, title}): Node => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

// const App: () => Node = () => {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.js</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//         {/* <RTCView key={stream.stream.toURL() + stream.videoMid} streamURL={stream.stream.toURL()} style={this.styles.video} objectFit='contain' /> */}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;




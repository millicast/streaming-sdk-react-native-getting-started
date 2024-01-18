import { ThemeProvider } from '@dolbyio/uikit-react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Provider } from 'react-redux';

import TranslationProvider from './providers/TranslationProvider';
import { Navigator } from './screens/Navigator';
import store from './store';

const App = () => {
  return (
    <TranslationProvider>
      <Provider store={store}>
        <NavigationContainer>
          <ThemeProvider>
            <Navigator />
          </ThemeProvider>
        </NavigationContainer>
      </Provider>
    </TranslationProvider>
  );
};

export default App;

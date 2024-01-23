import { ThemeProvider } from '@dolbyio/uikit-react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import TranslationProvider from './providers/TranslationProvider';
import { Navigator } from './screens/Navigator';
import { store, persistor } from './store';

const App = () => {
  return (
    <TranslationProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <ThemeProvider>
              <Navigator />
            </ThemeProvider>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </TranslationProvider>
  );
};

export default App;

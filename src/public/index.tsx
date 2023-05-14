import React from 'react';
import { createRoot } from 'react-dom/client';
import store from '../../store/store';
import { Provider } from 'react-redux';
import App from '../../router/AppRoutes';
import '../../client/styles/index.scss'

const container = document.getElementById('app');
const root = createRoot(container!!); 

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>    
  </React.StrictMode>
);
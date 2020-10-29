import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {ThemeProvider} from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'

const myTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#333'
    },
    secondary: {
      main: '#666'
    }
  }
})

ReactDOM.render(
  <ThemeProvider theme={myTheme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);

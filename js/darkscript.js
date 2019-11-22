var options = {
    bottom: '30px', // default: '32px'
    right: 'unset', // default: '32px'
    left: '30px', // default: 'unset'
    time: '0.5s', // default: '0.3s'
    mixColor: '#fff', // default: '#fff'
    backgroundColor: '#ddd',  // default: '#fff'
    buttonColorDark: '#222',  // default: '#100f2c'
    buttonColorLight: '#ddd', // default: '#fff'
    saveInCookies: false, // default: true,
    label: '🌓', // default: ''
    autoMatchOsTheme: true // default: true
  }
  
  const darkmode = new Darkmode(options);
  darkmode.showWidget();
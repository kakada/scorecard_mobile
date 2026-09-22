module.exports = {
  preset: 'react-native',
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest.setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-.*|@gorhom|@sentry/react-native|react-redux|redux|@reduxjs/toolkit|immer|reselect|redux-thunk|redux-saga|@redux-saga|@twotalltotems|axios)/)',
  ],
};

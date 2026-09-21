jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('react-native-splash-screen', () => ({ hide: jest.fn(), show: jest.fn() }));
jest.mock('@sentry/react-native', () => ({ init: jest.fn(), wrap: (component) => component }));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('react-native-device-info', () => require('react-native-device-info/jest/react-native-device-info-mock'));
jest.mock('@react-native-community/netinfo', () => require('@react-native-community/netinfo/jest/netinfo-mock'));
jest.mock('@react-native-firebase/app', () => ({ __esModule: true, default: () => ({}) }));
jest.mock('@react-native-firebase/analytics', () => ({ __esModule: true, default: () => ({ logEvent: jest.fn(), logScreenView: jest.fn() }) }));
jest.mock('@react-native-firebase/messaging', () => {
  const messaging = () => ({
    getToken: jest.fn(() => Promise.resolve('token')),
    hasPermission: jest.fn(() => Promise.resolve(1)),
    requestPermission: jest.fn(() => Promise.resolve(1)),
    onMessage: jest.fn(() => jest.fn()),
    onTokenRefresh: jest.fn(() => jest.fn()),
    onNotificationOpenedApp: jest.fn(() => jest.fn()),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
    setBackgroundMessageHandler: jest.fn(),
  });
  messaging.AuthorizationStatus = { AUTHORIZED: 1, PROVISIONAL: 2 };
  return { __esModule: true, default: messaging };
});
jest.mock('react-native-localize', () => ({ getLocales: () => [{ languageCode: 'en' }], getCountry: () => 'US' }));
jest.mock('react-native-localization', () => jest.fn().mockImplementation(() => ({ setLanguage: jest.fn(), getLanguage: () => 'en' })));
jest.mock('realm', () => {
  const realmInstance = {
    objects: jest.fn(() => { const results = Object.assign([], { filtered: jest.fn(() => results), sorted: jest.fn(() => results), max: jest.fn(() => null), min: jest.fn(() => null), sum: jest.fn(() => 0), addListener: jest.fn(), removeAllListeners: jest.fn() }); return results; }),
    write: jest.fn((callback) => callback && callback()),
    create: jest.fn(),
    delete: jest.fn(),
    objectForPrimaryKey: jest.fn(),
    close: jest.fn(),
  };
  const Realm = jest.fn(() => realmInstance);
  Realm.open = jest.fn(() => Promise.resolve(realmInstance));
  Realm.deleteFile = jest.fn();
  Realm.schemaVersion = jest.fn(() => -1);
  Realm.Object = class RealmObject {};
  Realm.UpdateMode = { Modified: 'modified', All: 'all' };
  return { __esModule: true, default: Realm };
});
jest.mock('react-native-fs', () => ({ DocumentDirectoryPath: '', CachesDirectoryPath: '', exists: jest.fn(() => Promise.resolve(false)), unlink: jest.fn(), mkdir: jest.fn(), readFile: jest.fn(), writeFile: jest.fn() }));
jest.mock('rn-fetch-blob', () => ({ __esModule: true, default: { fs: { dirs: {} }, config: jest.fn(), android: {} } }));
jest.mock('react-native-share', () => ({ __esModule: true, default: { open: jest.fn() } }));
jest.mock('react-native-sound', () => jest.fn().mockImplementation(() => ({ play: jest.fn(), stop: jest.fn(), release: jest.fn() })));
jest.mock('react-native-nitro-sound', () => ({ __esModule: true, default: {} }));
jest.mock('react-native-nitro-modules', () => ({}));
jest.mock('react-native-fast-image', () => 'FastImage');
jest.mock('react-native-image-crop-picker', () => ({ openPicker: jest.fn(), openCamera: jest.fn(), clean: jest.fn() }));
jest.mock('react-native-webview', () => ({ WebView: 'WebView', default: 'WebView' }));
jest.mock('react-native-youtube', () => 'YouTube');
jest.mock('@react-native-clipboard/clipboard', () => ({ setString: jest.fn(), getString: jest.fn() }));
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('react-native-version-check', () => ({ getCurrentVersion: jest.fn(), needUpdate: jest.fn(() => Promise.resolve({ isNeeded: false })) }));
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

const { NativeModules } = require('react-native');
NativeModules.NavigationMode = { getNavigationMode: jest.fn(() => Promise.resolve(2)) };

const { Linking } = require('react-native');
Linking.addEventListener = jest.fn(() => ({ remove: jest.fn() }));
Linking.getInitialURL = jest.fn(() => Promise.resolve(null));

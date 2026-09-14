import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Color from '../../themes/color';

/**
 * Wraps ANY trigger (text link, button, icon, card, image, etc.) and opens
 * `url` inside an in-app WebView modal, with a themed header:
 *   - Back chevron: goes back through the page's own history; if there's
 *     no history left, it closes the modal (feels like a real nav stack).
 *   - Title: optional, shown centered.
 *   - Close (✕): always exits the modal immediately.
 *
 * Usage — plain text link (backwards compatible):
 *   <LinkWithWebView url="https://example.com" linkText="Visit our site" />
 *
 * Usage — any custom view as the trigger, with a themed header:
 *   <LinkWithWebView
 *     url="https://example.com"
 *     title="Our Website"
 *     primaryColor="#1a73e8"
 *   >
 *     <View style={{ padding: 12, backgroundColor: '#1a73e8', borderRadius: 8 }}>
 *       <Text style={{ color: 'white', fontWeight: '600' }}>Open Website</Text>
 *     </View>
 *   </LinkWithWebView>
 */
export default function LinkWithWebView({
  url,
  linkText,
  children,
  title,
  primaryColor = Color.primaryButtonColor, // swap for your app's theme/primary color
}) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);

  const handleBackPress = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    } else {
      setVisible(false);
    }
  };

  const handleClose = () => setVisible(false);

  return (
    <View>
      <Pressable onPress={() => setVisible(true)}>
        {children ?? <Text style={styles.link}>{linkText}</Text>}
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={handleBackPress}
      >
        <StatusBar barStyle="light-content" backgroundColor={primaryColor} />
        <SafeAreaView style={[styles.container, { backgroundColor: primaryColor }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: primaryColor }]}>
            <TouchableOpacity onPress={handleBackPress} style={styles.headerButton} hitSlop={10}>
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.headerTitle} numberOfLines={1}>
              {title ?? ''}
            </Text>
          </View>

          {/* Page content */}
          <View style={styles.body}>
            {loading && <ActivityIndicator style={styles.loader} size="large" color={primaryColor} />}

            <WebView
              ref={webViewRef}
              source={{ uri: url }}
              style={{ flex: 1 }}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
              startInLoadingState
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    color: '#1a73e8',
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 4,
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
  },
});

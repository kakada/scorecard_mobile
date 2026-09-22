/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer';

it('renders correctly', async () => {
  let tree;

  await act(async () => {
    tree = renderer.create(<App />);
  });

  // Let the async startup work (AsyncStorage reads, deep link listener...) finish before the test ends
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  await act(async () => {
    tree.unmount();
  });
});

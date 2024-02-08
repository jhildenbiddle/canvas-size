const testSizes = {
  area: [
    // Chrome 70 (Mac, Win)
    // Chrome 68 (Android 4.4)
    // Edge 17 (Win)
    // Safari 7-12 (Mac)
    16384,
    // Chrome 68 (Android 7.1-9)
    14188,
    // Chrome 68 (Android 5)
    11402,
    // Firefox 63 (Mac, Win)
    11180,
    // Chrome 68 (Android 6)
    10836,
    // IE 9-11 (Win)
    8192,
    // IE Mobile (Windows Phone 8.x)
    // Safari (iOS 9 - 12)
    4096,
    // Failed
    1
  ],
  height: [
    // Safari 7-12 (Mac)
    // Safari (iOS 9-12)
    8388607,
    // Chrome 83 (Mac, Win)
    65535,
    // Chrome 70 (Mac, Win)
    // Chrome 68 (Android 4.4-9)
    // Firefox 63 (Mac, Win)
    32767,
    // Edge 17 (Win)
    // IE11 (Win)
    16384,
    // IE 9-10 (Win)
    8192,
    // IE Mobile (Windows Phone 8.x)
    4096,
    // Failed
    1
  ],
  width: [
    // Safari 7-12 (Mac)
    // Safari (iOS 9-12)
    4194303,
    // Chrome 83 (Mac, Win)
    65535,
    // Chrome 70 (Mac, Win)
    // Chrome 68 (Android 4.4-9)
    // Firefox 63 (Mac, Win)
    32767,
    // Edge 17 (Win)
    // IE11 (Win)
    16384,
    // IE 9-10 (Win)
    8192,
    // IE Mobile (Windows Phone 8.x)
    4096,
    // Failed
    1
  ]
};

export default testSizes;

import { systemPreferences } from 'electron'

/**
 * Listen for macOS appearance changes.
 */
systemPreferences.subscribeNotification(
  'AppleInterfaceThemeChangedNotification',
  function systemThemeChanged () {
    console.log('System appearance is DarkMode: ' + systemPreferences.isDarkMode())
    // updateMyAppTheme(systemPreferences.isDarkMode())
  }
)

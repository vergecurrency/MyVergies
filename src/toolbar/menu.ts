import { MenuItem } from 'electron'
import HelpMenu from './help'
import WindowMenu from './window'
import ViewMenu from './view'
import ServicesMenu from './services'
import AppMenu from './app'
import { isMacOSEnvironment } from '@/utils'

/**
 * macOS Dock menu items
 */
export const dockTemplate = [
  {
    label: 'Send',
    click () {
      console.log('Send')
    }
  },
  {
    label: 'Receive',
    click () {
      console.log('Receive')
    }
  },
  {
    label: 'Settings',
    click () {
      console.log('Settings')
    }
  }
]

/**
 * Application menu.
 */
export const generateMenuTemplate: () => MenuItem[] = () => [
  ...(isMacOSEnvironment() ? [AppMenu] : []),
  ServicesMenu,
  ViewMenu,
  WindowMenu,
  HelpMenu
]

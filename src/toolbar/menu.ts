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
export const dockTemplate = []

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

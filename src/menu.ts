import { app, MenuItem } from 'electron'

/**
 * macOS Dock menu items
 */
export const dockTemplate = [
  {
    label: 'Send',
    click () {
      console.log('Send')
    }
  }, {
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
export const template: MenuItem[] = []

const edit = {
  role: 'editMenu',
  submenu: [
    {
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    },
    {
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    },
    {
      type: 'separator'
    },
    {
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    },
    {
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    },
    {
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    },
    {
      accelerator: 'CmdOrCtrl+A',
      role: 'selectAll'
    }
  ]
}

const actions = {
  label: 'Actions',
  submenu: [
    {
      label: 'Lock wallet'
    },
    {
      type: 'separator'
    },
    {
      label: 'Send',
      click () {
        console.log('Send')
      }
    },
    {
      label: 'Receive',
      click () {
        console.log('Send')
      }
    }
  ]
}

const view = {
  role: 'viewMenu',
  submenu: [
    {
      role: 'resetzoom'
    },
    {
      role: 'zoomin'
    },
    {
      role: 'zoomout'
    },
    {
      type: 'separator'
    },
    {
      role: 'togglefullscreen'
    }
  ]
}

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  view.submenu.unshift({
    type: 'separator'
  })
  // @ts-ignore
  view.submenu.unshift({
    // @ts-ignore
    label: 'Toggle Developer Tools',
    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
    click (item: any, focusedWindow: any) {
      if (focusedWindow) focusedWindow.webContents.toggleDevTools()
    }
  })
  // @ts-ignore
  view.submenu.unshift({
    role: 'reload',
    // @ts-ignore
    accelerator: 'CmdOrCtrl+R',
    click (item: any, focusedWindow: any) {
      if (focusedWindow) focusedWindow.reload()
    }
  })
}

const window = {
  role: 'window',
  submenu: [
    {
      role: 'minimize'
    },
    {
      role: 'close'
    }
  ]
}

const help = {
  role: 'help',
  submenu: [
    {
      label: 'Learn how to create a new wallet'
    },
    {
      label: 'Learn how to restore an existing wallet'
    },
    {
      label: 'Learn how to send XVG'
    },
    {
      label: 'Learn how to receive XVG'
    },
    {
      type: 'separator'
    },
    {
      label: 'Visit our GitHub',
      click () {
        require('electron').shell.openExternal('https://github.com/vergecurrency')
      }
    },
    {
      label: 'Visit vergecurrency.com',
      click () {
        require('electron').shell.openExternal('https://vergecurrency.com')
      }
    }
  ]
}

// @ts-ignore
template.push(edit)
// @ts-ignore
template.push(actions)
// @ts-ignore
template.push(view)
// @ts-ignore
template.push(window)
// @ts-ignore
template.push(help)

if (process.platform === 'darwin') {
  const name = app.name
  template.unshift({
    label: name,
    role: 'appMenu',
    // @ts-ignore
    submenu: [
      {
        role: 'about'
      },
      {
        label: 'Check for Updates...'
      },
      {
        type: 'separator'
      },
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+,'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })

  // Window menu.
  // @ts-ignore
  template[3].submenu = [
    {
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      role: 'front'
    }
  ]
}

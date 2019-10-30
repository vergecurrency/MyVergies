import {app, Menu} from 'electron'

/**
 * macOS Dock menu items
 */
app.dock.setMenu(Menu.buildFromTemplate([
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
]))

/**
 * Application menu.
 */
let template = []

let actions = {
  label: 'Actions',
  submenu: [
    {
      label: 'Unlock'
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

let view = {
  label: 'View',
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
  view.submenu.unshift({
    type: 'separator'
  })
  view.submenu.unshift({
    label: 'Toggle Developer Tools',
    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
    click (item, focusedWindow) {
      if (focusedWindow) focusedWindow.webContents.toggleDevTools()
    }
  })
  view.submenu.unshift({
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click (item, focusedWindow) {
      if (focusedWindow) focusedWindow.reload()
    }
  })
}

let window = {
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

let help = {
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

template.push(actions)
template.push(view)
template.push(window)
template.push(help)

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        role: 'about'
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
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

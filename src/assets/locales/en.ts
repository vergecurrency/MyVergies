import { LocaleDefinition } from '@/locale/locale'

const en: LocaleDefinition = {
  name: 'English',
  main: {
    menu: {
      wallets: 'Wallets',
      add: 'Add new wallet',
      explorer: 'Explorer',
      contacts: 'Contacts'
    },
    copiedSuccessfully: 'Yes, copied successfully!',
    colors: {
      blue: 'Blue',
      red: 'Red',
      green: 'Green',
      purple: 'Purple',
      orange: 'Orange'
    },
    version: 'version'
  },
  welcome: {
    welcomeToMyVergies: 'Welcome to MyVergies',
    createdBy: 'Created by <b>Swen van Zanten</b>',
    addAWallet: 'Add a wallet',
    addAWalletDesc: 'You are able to add multiple wallets... this is awesome because I can think of a ton of reasons to have more than one!',
    addWallet: 'Add wallet',
    changeThings: 'Change things',
    changeThingsDesc: 'Within the settings you\'re able to tweak MyVergies into the perfect XVG wallet companion!',
    tweakSettings: 'Tweak settings',
    helpImprove: 'Help improve',
    helpImproveDesc: 'MyVergies\'s code is open source and can be downloaded and improved on by anyone out there (after approval). Let\'s build a better world together!',
    goToGithub: 'Go to GitHub'
  },
  tor: {
    status: {
      title: 'Tor Status',
      ip: 'IP Address',
      region: 'Region',
      unableToConnect: 'Unable to connect',
      loading: 'Loading ...',
      connected: 'Connected',
      disconnected: 'Disconnected'
    },
    toggle: 'Tor enabled'
  },
  unlock: {
    unlockYourWallet: 'Unlock your wallet',
    pin: 'PIN',
    forgotPin: 'I forgot my unlock PIN',
    youForgotYourPin: 'You forgot your PIN?',
    youForgotYourPinDesc: 'Thats very unfortunate! By asking your system nicely (by authenticating yourself) to provide us the PIN and enable you to reset your PIN we can restore your access.',
    resetPin: 'Reset PIN'
  },
  wallet: {
    settings: 'Settings',
    send: 'Send',
    receive: 'Receive',
    noTransactions: 'No transactions received yet',
    noTransactionsDesc: 'Received transactions can be found here'
  },
  transaction: {
    transaction: 'Transaction',
    sent: 'Sent',
    sending: 'Sending',
    received: 'Received',
    receiving: 'Receiving',
    moved: 'Moved',
    pending: 'Pending',
    amount: 'Amount',
    date: 'Date',
    details: 'Details',
    address: 'Address',
    confirmations: 'Confirmations',
    txid: 'TXID'
  },
  send: {
    formDescription: 'Carefully fill in the required form fields.',
    confirmDescription: 'Confirm sending the given amout of XVG to the selected recipient',
    sendingDescription: 'Sending in progress... this doesn\'t take long',
    send: 'Send',
    fillForm: 'Fill form',
    confirm: 'Confirm',
    sending: 'Sending',
    sent: 'Sent',
    recipient: 'Recipient',
    recipientDetails: 'Insert a valid XVG address or stealth address',
    amount: 'Amount',
    amountDetails: 'Fillin the amount you want to send, transaction fee will be calculated automatically',
    internalMemo: 'Internal memo',
    internalMemoDetails: 'An optional internal memo',
    sendMax: 'Send max',
    reset: 'Reset',
    confirmTransaction: 'Confirm transaction',
    cancel: 'Cancel',
    transactionFee: 'Transaction fee',
    total: 'Total',
    transactionWarning: 'Double check that the wallet address is correct. Verge Currency cannot be held accountable for loss of XVG sent to wrong wallets.',
    signing: 'Signing',
    publishing: 'Publishing',
    broadcasting: 'Broadcasting',
    transactionSent: 'Transaction sent!',
    transactionSentSubtitle: 'That\'s some epic stuff you great person',
    awesomeYouveDoneIt: 'Awesome, you did it!',
    whatToDoNext: 'What to do next?',
    seeTransaction: 'See transaction',
    seeTransactionDesc: 'Show the created transaction, explore it on the blockchain explorer or see if it is confirmed ;)',
    anotherTransaction: 'Send another transaction',
    anotherTransactionDesc: 'You could also send another transaction to someone else.',
    transaction: 'Transaction',
    orGoToWallet: 'Or...',
    orGoToWalletDesc: 'Go to your wallet view to create another transaction or receive some new XVG.',
    goToWallet: 'Go to wallet',
    done: 'Done',
    errors: {
      'INVALID_ADDRESS: Invalid address': 'The provided XVG address is invalid',
      'Insufficient funds': 'Insufficient funds for the given amount',
      'BADREQUEST: Invalid amount': 'The given amount is invalid',
      'Amount below dust threshold': 'The given amount is below the dust threshold'
    }
  },
  receive: {
    receive: 'Receive',
    newAddress: 'New address',
    previousAddresses: 'Previous addresses',
    yourReceiveAddress: 'Your receive address',
    qrCode: 'QR code',
    qrCodeDesc: 'You can scan this QR code with anyother XVG wallet to copy and use this receive address.',
    copy: 'Copy',
    addressCopied: 'Address Copied!'
  },
  createWallet: {
    createAWallet: 'Create a Wallet ✨',
    createAWalletDesc: 'Choose wisely! Do you have an existing wallet<br />from your iOS or Android device? Restore it here...<br />Or do you want to create a new wallet?',
    createANewWallet: 'Create a new wallet',
    restoreAnExistingWallet: 'Restore an existing wallet',
    or: 'Or',
    createNewWallet: 'Create new wallet',
    restoreExistingWallet: 'Restore existing wallet',
    addYourFirstWallet: 'Add your first wallet',
    itsReallyEasy: 'It\'s really easy!',
    aWalletName: 'A wallet name?',
    aWalletNameDescription: 'This app allows you to create multiple wallets in one easy to use app!<br>So because of that let\'s give this wallet a name.',
    walletName: 'Wallet name',
    enterYourWalletName: 'Enter your wallet name',
    walletColor: 'Wallet color',
    advanced: 'Advanced',
    singleAddress: 'Use a single address',
    serviceURL: 'Service URL',
    writeDownPaperKey: 'Write down paper key',
    preferences: 'Preferences',
    paperKey: 'Paper key',
    aPaperKey: 'A paper key?',
    aPaperKeyDescription: 'A paper key is 1 of the 2 parts to define your wallet and open your wallet in another app.<br>If you lose it you can never recover it and you\'ll loose access to your XVG.<br>So make absolutely sure to keep it very safe.',
    fillInYourPaperKey: 'Fill in your paper key',
    fillInYourPaperKeyDesc: 'In order to restore your previously used wallet you need to fill in your wallets paper key. Only enter lowercase modern latin alphabet characters. No spaces or special characters.',
    confirmPaperKey: 'Confirm paper key',
    invalidPaperkeySelected: 'The selected paper key is incorrect and doesn\'t match the original one. Please try again!',
    passPhrase: 'Pass phrase',
    passPhraseDescription: 'Encrypting your paper key is an important safety measure. Make sure when restoring a wallet to use your previous passphrase.',
    setupPassphraseReq1: 'Min. 8 characters',
    setupPassphraseReq2: 'Uppercase and lowercase',
    setupPassphraseReq3: 'Special character or number',
    setupPassphrasePassPlaceholder: 'Enter your passphrase',
    confirmPassphrase: 'Confirm your newly create passphrase',
    passphraseInvalid: 'The passphrase is incorrect and doesn\'t match the original one. Please try again!',
    confirm: 'Confirm',
    back: 'Back',
    proceed: 'Proceed',
    almostReady: 'Almost ready!',
    almostReadyDesc: 'We just need to know we\'re on the same level.',
    awesomeYouveDoneIt: 'Awesome, you\'ve done it!',
    createTerm1: 'I understand that the only way to restore this wallet is by providing the <b>paper key</b> and the <b>pass phrase</b>. If any of these credentials are lost or differ from this setup there is no way to recover them. I\'m solely responsible for these credentials. Not the developers of this application.',
    createTerm2: 'I understand that this wallets credentials are stored in my systems <b>credentials register</b>. And that these credentials aren\'t covered by automatic backups by default.',
    createTerm3: 'I have read, understood, and agree to the Terms of Use.',
    termsOfUse: 'Terms of Use',
    openTermsOfUseConfirm: 'You\'re about to open an external webpage inside your default browser',
    createWallet: 'Create wallet',
    creatingWallet: 'Your wallet is being created...',
    walletCreated: 'Your wallet has been successfully created!',
    whatToDoNext: 'What to do next?',
    exportYourWallet: 'Export your wallet',
    exportYourWalletDesc: 'Creating an extra backup of your wallet credentials can be a smart thing to do. Either store it safely on a removable drive or another secure place.',
    exportWallet: 'Export wallet',
    sendXvgToYourWallet: 'Send XVG to your wallet',
    sendXvgToYourWalletDesc: 'You\'ve created a wallet but don\'t want to receive XVG on it? Right of course do you!',
    receiveXvg: 'Receive XVG',
    orGoToWallet: 'Or...',
    orGoToWalletDesc: 'Go to your wallet view where you can handle each of the above.',
    goToWallet: 'Go to wallet',
    importWallet: 'Import wallet',
    coin: 'Coin',
    network: 'Network',
    openFile: 'Open file',
    openFileDesc: 'If you exported your wallet before you can drag and drop or choose your file from the file dialog to import the wallet.',
    openWalletFile: 'Open wallet file',
    dropWalletFile: 'Drop your wallet file here',
    confirmImportDesc: 'Review the import files wallet configuration and change values if needed. If satisfied go ahead with the import.',
    walletNameAlreadyExists: 'This wallet name already exists, motify the wallets name to continue the import.',
    import: 'Import',
    usesSingleAddress: 'Uses single address'
  },
  walletSettings: {
    walletSettings: 'Wallet settings',
    preferences: 'Preferences',
    name: 'Name',
    nameDesc: 'The wallets name is needed because you can have multiple wallets inside this awesome application!',
    color: 'Color',
    colorDesc: 'Give the wallet card your favorite color!',
    service: 'Service',
    serviceUrl: 'Service URL',
    serviceUrlDesc: 'This wallet depends on Verge Wallet Service (VWS) for blockchain information, networking and Copayer synchronization. You\'re always able to change this into your own VWS instance.',
    credentials: 'Credentials',
    paperKey: 'Paper key',
    passphrase: 'Passphrase',
    passphraseDesc: 'The passphrase is 2nd of the 2 parts to define your wallet and open your wallet in another app. If you loose it you can never recover it and you\'ll loose access to your XVG. So make absolutely sure to keep it very safe.',
    showPassphrase: 'Show passphrase',
    yourWalletsPassphrase: 'Your wallets passphrase',
    dangerZone: 'Danger zone',
    delete: 'Delete',
    deleteWallet: 'Delete wallet',
    deleteWalletDesc: 'This will delete your wallet from this application. Your wallet can still be restored by using your paper key and pass phrase. Please make absolutely sure you\'ve written down your paper key and know your pass phrase. Remember that your paper key + pass phrase is the only way to restore your current wallet.',
    deleteWalletConfirm: 'Are you sure you want to the delete your wallet <b>{name}</b>?',
    walletDeleted: 'Wallet <b>{name}</b> was deleted!'
  },
  settings: {
    settings: 'Settings',
    security: 'Security',
    language: 'Language',
    currency: 'Currency',
    currencyDetails: 'All fiat prices will be displayed in this currency',
    pin: 'PIN',
    pinDetails: 'Secure MyVergies with a personal PIN code.',
    changePin: 'Change PIN',
    lockAfter: 'Lock after',
    lockAfterDetails: 'Lock application after the given amount of time',
    connection: 'Connection',
    torConnection: 'TOR connection',
    manageTorConnection: 'Manage TOR connection',
    changeYourPin: 'Change your PIN',
    changeYourPinDesc: 'You\'re about to change the PIN used as a security measure by this application.',
    currentPin: 'Current PIN',
    currentPinDesc: 'Fill in your current PIN used to unlock this application',
    newPin: 'New PIN',
    newPinDesc: 'Fill in your new PIN, make sure you\'ll remember it after this change ;)',
    newPinConfirmation: 'Confirm new PIN',
    newPinConfirmationDesc: 'To verify you filled in the new PIN correctly let\'s confirm the input.',
    cancel: 'Cancel',
    couldntChangePin: 'Couldn\'t change PIN',
    pinChanged: 'PIN changed!',
    addPin: 'Add PIN',
    addPinDesc: 'This applications secures all your wallets and settings with an easy to remember PIN. Let\'s set one up.',
    couldntSetPin: 'Couldn\'t set your PIN',
    pinAdded: 'PIN was set, enjoy MyVergies!'
  },
  export: {
    description: 'Creating an extra backup of your wallet credentials can be a smart thing to do. Either store it safely on a removable drive or another secure place.',
    condition1: 'Make sure to store your exported wallet file on a secure and trusted place',
    condition2: 'You are responsible for who is able to access this file',
    condition3: 'Everything needed to send and steal your funds is in this file',
    fileEncryption: 'File encryption',
    fileEncryptionDesc: 'Because the export file contains all the data to your wallet we encourage you to encrypt your export file with a password.',
    passwordPlaceholder: 'Your file encryption password',
    confirmation: 'I understand what I\'m doing and want to export my wallet into a separate file.',
    exportFile: 'Save export',
    unknownError: 'Wallet wasn\'t exported because of an unknown reason',
    successfulExport: 'Successfully exported wallet!'
  }
}
export default en

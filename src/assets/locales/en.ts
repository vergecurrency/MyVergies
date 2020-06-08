import { LocaleDefinition } from '@/locale/locale'

const en: LocaleDefinition = {
  main: {
    menu: {
      wallets: 'Wallets',
      add: 'Add new wallet',
      explorer: 'Explorer',
      contacts: 'Contacts'
    },
    copiedSuccessfully: 'Yes, copied successfully!'
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
    password: 'Password',
    forgotPassword: 'I forgot my unlock password'
  },
  wallet: {
    send: 'Send',
    receive: 'Receive'
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
    transactionSent: 'Transaction sent',
    transactionSentSubtitle: 'That\'s some epic stuff you great person',
    done: 'Done'
  },
  createWallet: {
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
    aPaperKeyDescription: 'A paper key is 1 of the 2 parts to define your wallet and open your wallet in another app.<br>If you loose it you can never recover it and you\'ll loose access to your XVG.<br>So make absolutely sure to keep it very safe.',
    fillInYourPaperKey: 'Fill in your paper key',
    fillInYourPaperKeyDesc: 'In order to restore your previously used wallet you need to fill in your wallets paper key. Only enter lowercase modern latin alphabet characters. No spaces or special characters.',
    confirmPaperKey: 'Confirm paper key',
    invalidPaperkeySelected: 'The selected in paper key isn\'t correct and doesn\'t match the original one. Please try again!',
    passPhrase: 'Pass phrase',
    passPhraseDescription: 'Encrypting your paper key is an important safety measure. Make sure when restoring a wallet to use your previous passphrase.',
    setupPassphraseReq1: 'Min. 8 characters',
    setupPassphraseReq2: 'Uppercase and lowercase',
    setupPassphraseReq3: 'Special character or number',
    setupPassphrasePassPlaceholder: 'Enter your passphrase',
    confirmPassphrase: 'Confirm your newly create passphrase',
    passphraseInvalid: 'The filled in passphrase isn\'t correct and doesn\'t match the original one. Please try again!',
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
    exportYourWalletDesc: 'Creating an extra backup of your wallet credentials can be a smart thing to do. Either store it savely on a removable drive or another secure place.',
    exportWallet: 'Export wallet',
    sendXvgToYourWallet: 'Send XVG to your wallet',
    sendXvgToYourWalletDesc: 'You\'ve created a wallet but don\'t want to receive XVG on it? Right of course do you!',
    receiveXvg: 'Receive XVG',
    orGoToWallet: 'Or...',
    orGoToWalletDesc: 'Go to your wallet view where you can handle each of the above.',
    goToWallet: 'Go to wallet'
  },
  walletSettings: {
    walletSettings: 'Wallet settings',
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
    password: 'Password',
    changePassword: 'Change password',
    lockAfter: 'Lock after',
    lockAfterDetails: 'Lock application after the given amount of time',
    connection: 'Connection',
    torConnection: 'TOR connection',
    manageTorConnection: 'Manage TOR connection'
  }
}
export default en

import Vue from 'vue'
import Buefy from 'buefy'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faLock,
  faLockOpen,
  faCog,
  faEdit,
  faCreditCard,
  faHandHoldingUsd,
  faWallet,
  faHandPointer,
  faAddressBook,
  faSearch,
  faPlus,
  faGlobe,
  faRedo,
  faInfo,
  faInfoCircle,
  faCoins,
  faAngleRight,
  faAngleLeft,
  faStar,
  faList,
  faCheck,
  faCheckCircle,
  faCircle,
  faUser,
  faMoneyBill,
  faCircleNotch,
  faPlusCircle,
  faMinusCircle,
  faTruck,
  faHourglassHalf,
  faSatelliteDish,
  faQuestionCircle,
  faWifi,
  faIdCard,
  faEye,
  faEyeSlash,
  faCopy,
  faListUl,
  faExclamationCircle,
  faFolderOpen,
  faFileContract,
  faFileImport,
  faTimes,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons'

library.add(faLock)
library.add(faLockOpen)
library.add(faCog)
library.add(faEdit)
library.add(faCreditCard)
library.add(faHandHoldingUsd)
library.add(faWallet)
library.add(faHandPointer)
library.add(faAddressBook)
library.add(faSearch)
library.add(faPlus)
library.add(faRedo)
library.add(faInfo)
library.add(faInfoCircle)
library.add(faCoins)
library.add(faAngleLeft)
library.add(faAngleRight)
library.add(faGlobe)
library.add(faStar)
library.add(faList)
library.add(faCheck)
library.add(faCheckCircle)
library.add(faCircle)
library.add(faUser)
library.add(faMoneyBill)
library.add(faCircleNotch)
library.add(faPlusCircle)
library.add(faMinusCircle)
library.add(faTruck)
library.add(faHourglassHalf)
library.add(faSatelliteDish)
library.add(faQuestionCircle)
library.add(faWifi)
library.add(faIdCard)
library.add(faEye)
library.add(faEyeSlash)
library.add(faCopy)
library.add(faListUl)
library.add(faExclamationCircle)
library.add(faFolderOpen)
library.add(faFileContract)
library.add(faFileImport)
library.add(faTimes)
library.add(faEllipsisV)

Vue.use(Buefy, {
  defaultIconComponent: 'fa-icon',
  defaultIconPack: 'fas'
})
Vue.component('fa-icon', FontAwesomeIcon)

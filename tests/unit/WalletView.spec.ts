import { shallowMount, createLocalVue } from '@vue/test-utils'
import WalletView from '@/views/Wallet/WalletView.vue'
import Buefy from 'buefy'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(Buefy)
localVue.use(VueRouter)

test('should render correct contents', () => {
  const wallet = {
    name: 'Main Account',
    color: 'blue',
    info: {
      wallet: {
        coin: 'test'
      },
      balance: {
        totalAmount: 123000000,
        byAddress: []
      }
    },
    txProposals: []
  }

  const wrapper = shallowMount(WalletView, {
    localVue,
    propsData: {
      wallet
    },
    mocks: {
      $i18n: {
        t (key: string) {
          return key
        }
      }
    }
  })

  expect(wrapper.text()).toContain(wallet.name)
})

test('can reveal per-address balances', async () => {
  const wallet = {
    name: 'Main Account',
    color: 'blue',
    info: {
      wallet: {
        coin: 'test'
      },
      balance: {
        totalAmount: 123000000,
        byAddress: [
          {
            address: 'D8tF73Fd56BgsGGxe9ZQP4v3amU4cMxyMT',
            path: 'm/0/0',
            amount: 23000000
          }
        ]
      }
    },
    txProposals: []
  }

  const wrapper = shallowMount(WalletView, {
    localVue,
    propsData: {
      wallet
    },
    mocks: {
      $i18n: {
        t (key: string) {
          return key
        }
      },
      $electron: {
        remote: {
          app: {
            getLocale: () => 'en'
          }
        }
      }
    }
  })

  expect(wrapper.text()).not.toContain('D8tF73Fd56BgsGGxe9ZQP4v3amU4cMxyMT')

  await wrapper.setData({ showAddressBalances: true })

  expect(wrapper.text()).toContain('D8tF73Fd56BgsGGxe9ZQP4v3amU4cMxyMT')
  expect(wrapper.text()).toContain('xpub/0/0')
})

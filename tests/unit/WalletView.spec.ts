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
        totalAmount: 123000000
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

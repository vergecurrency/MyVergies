import { shallowMount, createLocalVue } from '@vue/test-utils'
import ReceiveView from '@/views/Wallet/Receive/ReceiveView.vue'
import Buefy from 'buefy'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(Buefy)
localVue.use(VueRouter)

test('should render correct contents', async () => {
  const address = 'DF7R7M5semP472WSvK6WPZkDM1h9ixTL6F'
  const wallet = {
    name: 'Main Account',
    amount: 123,
    color: 'blue',
    getAddress: () => {
      return new Promise(resolve => {
        resolve({ address })
      })
    }
  }

  const wrapper = shallowMount(ReceiveView, {
    localVue,
    propsData: {
      wallet
    },
    mocks: {
      $i18n: {
        t: (key: string) => key
      }
    }
  })

  await wrapper.vm.$nextTick()
  expect(wrapper.vm.$data.address).toBe(address)
  expect(wrapper.text()).toContain(address)
})

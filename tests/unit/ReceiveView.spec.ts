import { shallowMount, createLocalVue } from '@vue/test-utils'
import ReceiveView from '@/views/Wallet/Receive/ReceiveView.vue'
import Buefy from 'buefy'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(Buefy)
localVue.use(VueRouter)

test('should render correct contents', () => {
  const wallet = {
    name: 'Main Account',
    amount: 123,
    color: 'blue'
  }

  const wrapper = shallowMount(ReceiveView, {
    localVue,
    propsData: {
      wallet
    }
  })

  expect(wrapper.text()).toContain('DF7R7M5semP472WSvK6WPZkDM1h9ixTL6F')
})

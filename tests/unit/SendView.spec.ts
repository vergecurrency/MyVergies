import { shallowMount, createLocalVue } from '@vue/test-utils'
import SendView from '@/views/Wallet/Send/SendView.vue'
import Buefy from 'buefy'
import VueRouter from 'vue-router'
import electron from 'electron'
import Vue from 'vue/types/vue'

const localVue = createLocalVue()
localVue.use(Buefy)
localVue.use(VueRouter)

test('should render correct contents', () => {
  const wallet = {
    name: 'Main Account',
    amount: 123,
    color: 'blue'
  }

  const wrapper = shallowMount(SendView, {
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

  expect(wrapper.text()).toContain('')
})

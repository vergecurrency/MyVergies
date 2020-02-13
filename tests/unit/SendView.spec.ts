import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import SendView from '@/views/SendView.vue'
import Buefy from 'buefy'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(Buefy)
localVue.use(VueRouter)

describe('SendView.vue', () => {
  it('should render correct contents', () => {
    const wallet = {
      name: 'Main Account',
      amount: 123,
      color: 'blue'
    }

    const wrapper = shallowMount(SendView, {
      localVue,
      propsData: {
        wallet
      }
    })

    expect(wrapper.text()).to.include('Send')
    // expect(wrapper.text()).to.include('Recipient')
    // expect(wrapper.text()).to.include('Amount')
    // expect(wrapper.text()).to.include('Memo')
    // expect(wrapper.text()).to.include('Confirm')
  })
})

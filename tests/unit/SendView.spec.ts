import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import SendView from '@/views/SendView.vue'

describe('SendView.vue', () => {
  it('should render correct contents', () => {
    const wallet = {
      name: 'Main Account',
      amount: 123,
      color: 'blue'
    }

    const wrapper = shallowMount(SendView, {
      propsData: {
        wallet
      }
    })

    expect(wrapper.text()).to.include('Send')
    expect(wrapper.text()).to.include('Recipient')
    expect(wrapper.text()).to.include('Amount')
    expect(wrapper.text()).to.include('Memo')
    expect(wrapper.text()).to.include('Confirm')
  })
})

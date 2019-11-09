import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import WalletView from '@/views/WalletView.vue'

describe('WalletView.vue', () => {
  it('should render correct contents', () => {
    const wallet = {
      name: 'Main Account',
      amount: 123,
      color: 'blue'
    }

    const wrapper = shallowMount(WalletView, {
      propsData: {
        wallet
      }
    })

    expect(wrapper.text()).to.include(wallet.name)
  })
})

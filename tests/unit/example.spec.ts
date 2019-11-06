import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import WalletView from '@/components/WalletView.vue'

describe('WalletView.vue', () => {
  it('should render correct contents', () => {
    const msg = 'Main Account'
    const wrapper = shallowMount(WalletView)
    expect(wrapper.text()).to.include(msg)
  })
})

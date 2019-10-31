import Vue from 'vue'
import App from '@/components/WalletView'

describe('WalletView.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(App)
    }).$mount()

    expect(vm.$el.querySelector('.box').textContent).to.contain('Main Account')
  })
})

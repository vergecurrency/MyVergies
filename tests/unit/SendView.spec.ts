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

test('mempool conflicts unlock send view and clear the stale proposal', async () => {
  const staleTxp = { id: 'stale-txp' }
  const wallet = {
    name: 'Main Account',
    amount: 123,
    color: 'blue',
    removeTxProposal: jest.fn(() => Promise.resolve([])),
    status: jest.fn(() => Promise.resolve({})),
    fetchTxHistory: jest.fn(() => Promise.resolve([])),
    getTxProposals: jest.fn(() => Promise.resolve([]))
  }
  const dialog = {
    alert: jest.fn()
  }

  const wrapper = shallowMount(SendView, {
    localVue,
    propsData: {
      wallet
    },
    mocks: {
      $i18n: {
        t: (key: string) => key === 'send.errors.MEMPOOL_CONFLICT'
          ? 'localized mempool conflict message'
          : key
      },
      $buefy: {
        dialog
      }
    }
  })

  wrapper.setData({
    viewLocked: true,
    activeStep: 2,
    transaction: {
      toAddress: 'D...',
      recipientLabel: '',
      resolvedDomain: '',
      resolvedAddress: '',
      amount: 1,
      message: '',
      txp: staleTxp
    }
  })

  await (wrapper.vm as any).handleSendFailure(new Error('500 - "txn-mempool-conflict (code 18)"'))

  expect(wallet.removeTxProposal).toHaveBeenCalledWith(staleTxp)
  expect(wallet.status).toHaveBeenCalled()
  expect(wallet.fetchTxHistory).toHaveBeenCalled()
  expect(wallet.getTxProposals).toHaveBeenCalled()
  expect((wrapper.vm as any).viewLocked).toBe(false)
  expect((wrapper.vm as any).activeStep).toBe(0)
  expect((wrapper.vm as any).transaction.txp).toBeNull()
  expect(dialog.alert).toHaveBeenCalledWith(expect.objectContaining({
    message: 'localized mempool conflict message'
  }))
})

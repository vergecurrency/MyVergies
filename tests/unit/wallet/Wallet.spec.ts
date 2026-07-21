import Wallet from '@/walletManager/Wallet'

test('removeTxProposal resolves with refreshed proposals', async () => {
  const proposals = [{ id: 'remaining-txp' }]
  const vwc = {
    removeTxProposal: jest.fn((_proposal, callback) => callback(null)),
    getTxProposals: jest.fn((_options, callback) => callback(null, proposals))
  }
  const wallet = new Wallet('wallet-id', 'Wallet', 'blue', vwc as any)

  await expect(wallet.removeTxProposal({ id: 'stale-txp' } as any)).resolves.toBe(proposals)

  expect(vwc.removeTxProposal).toHaveBeenCalledWith({ id: 'stale-txp' }, expect.any(Function))
  expect(vwc.getTxProposals).toHaveBeenCalled()
  expect(wallet.txProposals).toBe(proposals)
})

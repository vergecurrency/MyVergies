import { isVwsVersionResponse } from '@/utils/vwsApi'

describe('VWS API readiness response', () => {
  it('accepts BWS and VWS service version responses', () => {
    expect(isVwsVersionResponse({ serviceVersion: 'bws-8.1.1' })).toBe(true)
    expect(isVwsVersionResponse({ serviceVersion: 'vws-1.0.0' })).toBe(true)
  })

  it('rejects unrelated or malformed successful responses', () => {
    expect(isVwsVersionResponse({ serviceVersion: 'website-1.0.0' })).toBe(false)
    expect(isVwsVersionResponse({})).toBe(false)
    expect(isVwsVersionResponse(null)).toBe(false)
  })
})

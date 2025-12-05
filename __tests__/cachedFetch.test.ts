// Ensure API key exists during tests so importing the module doesn't throw
;(process.env as any).OPENWEATHER_API_KEY = (process.env as any).OPENWEATHER_API_KEY || 'test'
const { cachedFetch, makeCacheKey } = require('@/lib/weather-api') as typeof import('@/lib/weather-api')

describe('cachedFetch helper', () => {
  let _dateNowSpy: jest.SpyInstance<number, []>
  beforeEach(() => {
    jest.useFakeTimers()
    // mock Date.now() so TTL checks can be controlled without relying on modern timers
    let _now = Date.now()
    _dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => _now)
    ;(global as any).__TEST_NOW = () => _now
    ;(global as any).__ADVANCE_NOW = (ms: number) => { _now += ms }
  })

  afterEach(() => {
    jest.useRealTimers()
    _dateNowSpy.mockRestore()
  })

  it('dedupes concurrent requests (single fetcher invocation)', async () => {
    let calls = 0
    const key = makeCacheKey('GET', '/test/dedupe', { q: 'x' })

    const fetcher = () =>
      new Promise<number>((resolve) => {
        calls++
        setTimeout(() => resolve(42), 50)
      })

    const p1 = cachedFetch<number>(key, 1000, fetcher)
    const p2 = cachedFetch<number>(key, 1000, fetcher)

    // advance timers so the delayed fetcher resolves
    jest.advanceTimersByTime(60)

    const results = await Promise.all([p1, p2])
    expect(results).toEqual([42, 42])
    expect(calls).toBe(1)
  })

  it('evicts after TTL and refetches', async () => {
    let calls = 0
    const key = makeCacheKey('GET', '/test/ttl', { id: 'a' })

    const fetcher1 = () => {
      calls++
      return Promise.resolve('first')
    }

    const res1 = await cachedFetch<string>(key, 100, fetcher1)
    expect(res1).toBe('first')
    expect(calls).toBe(1)

    // advance system time past TTL
    ;(global as any).__ADVANCE_NOW(200)

    const fetcher2 = () => {
      calls++
      return Promise.resolve('second')
    }

    const res2 = await cachedFetch<string>(key, 100, fetcher2)
    expect(res2).toBe('second')
    expect(calls).toBe(2)
  })

  it('does not cache failed fetches', async () => {
    let calls = 0
    const key = makeCacheKey('GET', '/test/error', {})

    const failing = () =>
      new Promise<number>((_, reject) => {
        calls++
        setTimeout(() => reject(new Error('fail')), 50)
      })

    const success = () => {
      calls++
      return Promise.resolve(7)
    }

    // first call fails
    const p = cachedFetch<number>(key, 1000, failing)
    jest.advanceTimersByTime(60)
    await expect(p).rejects.toThrow('fail')

    // after failure, a successful fetcher should run and return value
    const res = await cachedFetch<number>(key, 1000, success)
    expect(res).toBe(7)
    expect(calls).toBe(2)
  })
})

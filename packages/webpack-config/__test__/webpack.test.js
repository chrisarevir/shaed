import shaedWebpack from '../src/index'

describe('shaed-webpack', () => {
  describe('default', () => {
    it('has all the necessary keys', () => {
      const defaultConfig = shaedWebpack()

      expect(defaultConfig).toHaveProperty('entry')
      expect(defaultConfig).toHaveProperty('entry.index')
      expect(defaultConfig).toHaveProperty('devServer')
      expect(defaultConfig).toHaveProperty('devtool')
      expect(defaultConfig).toHaveProperty('mode')
      expect(defaultConfig).toHaveProperty('module')
      expect(defaultConfig).toHaveProperty('optimization')
      expect(defaultConfig).toHaveProperty('output')
      expect(defaultConfig).toHaveProperty('plugins')
      expect(defaultConfig).toHaveProperty('resolve')
    })
  })

  describe('basic merge', () => {
    it('adds in an extra entry', () => {
      const basicMerge = shaedWebpack({ entry: { other: 'other string' } })

      expect(basicMerge).toHaveProperty('entry.index')
      expect(basicMerge.entry).toMatchObject({ other: 'other string' })
    })
  })

  describe('callback merge', () => {
    describe('arguments', () => {
      it('first argument is a function', () => {
        let arg

        shaedWebpack((merge, defaultConfig) => {
          arg = merge
          return defaultConfig
        })

        expect(typeof arg).toEqual('function')
      })

      it('second argument is an object', () => {
        let arg

        shaedWebpack((_, defaultConfig) => {
          arg = defaultConfig
          return defaultConfig
        })

        expect(typeof arg).toEqual('object')
      })
    })

    it('adds in an extra entry', () => {
      const funcMerge = shaedWebpack((merge, defaultConfig) => {
        return merge(defaultConfig, { entry: { other: 'other string' } })
      })

      expect(funcMerge).toHaveProperty('entry.index')
      expect(funcMerge.entry).toMatchObject({ other: 'other string' })
    })
  })
})

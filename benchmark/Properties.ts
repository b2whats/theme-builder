import Benchmark from 'benchmark'
import { properties, tokens } from '../src/fixtures'

const Circular = <T extends string | null | boolean | number>(arr: T[]) => {
  let i = 0
  const n = arr.length

  return () => arr[i++ % n]
}

const display = Circular(['block', 'flex', 'inline'])
const fontSize = Circular(["xxxxxl", "xxxxl", "xxxl", "xxl", "xl", "l", "m", "s", "xs"])
const focus = Circular([true, false])
const shadow = Circular([1, 2, 3, 4])

var suite = new Benchmark.Suite();

// suite.add('without token(No cache)', function() {
//   properties.rules['display'](display(), tokens.scheme)
// })
suite.add('nested token(No cache)', function() {
  properties.rules['fontSize'](fontSize(), tokens.scheme)
})
// suite.add('boolean token(No cache)', function() {
//   properties.rules['focus'](focus(), tokens.scheme)
// })

suite.add('nested token(cache)', function() {
  properties.compute('fontSize', fontSize(), tokens.scheme)
})
suite.add('without token(cache)', function() {
  properties.compute('display', display(), tokens.scheme)
})

suite.add('boolean token(cache)', function() {
  properties.compute('focus', focus(), tokens.scheme)
})

suite.add('number token(cache)', function() {
  properties.compute('shadow', shadow(), tokens.scheme)
})

// const na: ['s', 'm', 'l'] = ['s', 'm', 'l']
// suite.add('nested token(cache) array', function() {
//   properties.compute('fontSize', na, tokens.scheme)
// })
// const wa: ['block', 'flex', 'inline' ] = ['block', 'flex', 'inline' ]
// suite.add('without token(cache) array', function() {
//   properties.compute('display', wa, tokens.scheme)
// })

// const ba: [true, false, true] = [true, false, true]
// suite.add('boolean token(cache) array', function() {
//   properties.compute('focus', ba, tokens.scheme)
// })

// const nua: [1, 2, 1] = [1, 2, 1]
// suite.add('number token(cache) array', function() {
//   properties.compute('shadow', nua, tokens.scheme)
// })

suite.on('cycle', function(event: any) {
  console.log(String(event.target));
})
.run({
  async: true,
});


/*
without token(No cache) x 824,016,793 ops/sec ±1.52% (82 runs sampled)
nested token(No cache) x 2,316,602 ops/sec ±1.29% (93 runs sampled)
boolean token(No cache) x 7,086,732 ops/sec ±0.73% (90 runs sampled)
*/
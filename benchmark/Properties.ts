import Benchmark from 'benchmark'
import { properties, tokens } from '../src/fixtures'


var suite = new Benchmark.Suite;

suite.add('without token(No cache)', function() {
  properties.rules['display']('block', tokens.scheme)
})
suite.add('nested token(No cache)', function() {
  properties.rules['fontSize']('s', tokens.scheme)
})
suite.add('boolean token(No cache)', function() {
  properties.rules['focus'](true, tokens.scheme)
})

suite.add('nested token(cache)', function() {
  properties.compute('fontSize', 's', tokens.scheme)
})
suite.add('without token(cache)', function() {
  properties.compute('display', 'block', tokens.scheme)
})

suite.add('boolean token(cache)', function() {
  properties.compute('focus', true, tokens.scheme)
})

suite.add('number token(cache)', function() {
  properties.compute('shadow', 1, tokens.scheme)
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
.run({ 'async': true });


/*
without token(No cache) x 824,016,793 ops/sec ±1.52% (82 runs sampled)
nested token(No cache) x 2,316,602 ops/sec ±1.29% (93 runs sampled)
boolean token(No cache) x 7,086,732 ops/sec ±0.73% (90 runs sampled)
*/
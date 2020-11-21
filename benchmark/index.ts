// @ts-nocheck
import Benchmark from 'benchmark'

var suite = new Benchmark.Suite;

suite.add('RegExp#test', function() {
  /o/.test('Hello World!');
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });
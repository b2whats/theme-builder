// @ts-nocheck
import hash from '@emotion/hash'
import Benchmark from 'benchmark'

const makeId = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const len10 = makeId(10)
const len100 = makeId(100)
const len1000 = makeId(1000)
const len10000 = makeId(10000)

var suite = new Benchmark.Suite;

suite.add('string 10', function() {
  hash(len10)
})
suite.add('string 100', function() {
  hash(len100)
})
suite.add('string 1 000', function() {
  hash(len1000)
})
suite.add('string 10 000', function() {
  hash(len10000)
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run({ 'async': true });
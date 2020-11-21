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

// function hash(str) {
//   var hash = 5381,
//       i    = str.length;

//   while(i) {
//     hash = (hash * 33) ^ str.charCodeAt(--i);
//   }

//   /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
//    * integers. Since we want the results to be always positive, convert the
//    * signed int to an unsigned by doing an unsigned bitshift. */
//   return hash >>> 0;
// }

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
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });
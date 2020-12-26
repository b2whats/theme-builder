import {compile, serialize, stringify, middleware} from 'stylis'
import { mergeStyles } from './src/ThemeBuilder'

const styles = mergeStyles(['', {}, () => {}, '', {}, {}, () => {}])

var a = compile(`
    font-family: inherit;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    margin: 0;
    color: green;
    line-height: 0;
    position: relative;
    white-space: nowrap;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-touch-callout: none;
    &::-moz-focus-inner {
        border: 0;
    }
    color: red;
    &[data-group~='vertical']:not([data-group~='first']):not([data-group~='spacing']) {
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
      }
`)
serialize(compile('h1{all:unset}'), middleware([(element, index, children, callback) => {
	if (element.type === 'decl' && element.props === 'all' && element.children === 'unset')
		element.return = 'color:red;' + element.value
}, stringify]))
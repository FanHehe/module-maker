const fs = require('fs');
const ModuleMaker = require('../src/ModuleMaker');

process.chdir(__dirname);

if (!fs.existsSync('./.tmp')) {
	fs.mkdirSync('./.tmp');
}

const target = {
	b: {
		_: 'xxxxx',
		a: 1, 
		b: 'ddddddddd',
		d: JSON.stringify({a: 1}),
		e: 'fdsafdsf',
		f: null,
		g: undefined,
		h: () => {},
		i: new Date(),
		h: 'cvxxxxxxxxxxxxx',
	},
	d: {
		a: 1,
		b: '2'
	}
};

var A = ModuleMaker.require('./.tmp');
var B = ModuleMaker.require('./.tmp/');
var C = ModuleMaker.require('./.tmp/.js');
var D = ModuleMaker.require('./.tmp/.js');
var E = ModuleMaker.require('./.tmp/tmp.js');
var F = ModuleMaker.require('./.tmp/tmp.json');
var G = ModuleMaker.require('./.tmp/test.js');
var H = ModuleMaker.require('./.tmp/test.json');
var I = ModuleMaker.require('../.tmp');
var J = ModuleMaker.require('../tests/');
var K = ModuleMaker.require('../tests/tmp.json.js');

for (let item of [A, B, C, D, E, F, G, H, I, J, K]) {
	Object.assign(item, target);
	item.save();
}

# @module-maker

## 说明

比较方便的加载相对路径下的module，然后能够写些数据回去。

适合用于生成js or json类型的配置文件。

## 要求
- NodeJs 7.6+
## 使用方式

```javascript

// 加载本模块
const proxy = require('module-maker');
	
// 存在这个文件则加载，不存在则新建这个文件。
// 默认生成js文件，可以根据文件名后缀，生成js或者json
const target = proxy.require('../index.js');

// 直接修改required的对象
target.obj = {
    a: 1,
    b: '2',
    c: null,
    d: undefined
};

target.ccc = 1;
	
// 将加到到的配置写回原文件
target.save();
```

#### 示例

> 内容来自本模块的测试文件，运行npm install && npm run test 即可测试 

```javascript
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

const ModuleMaker = reuqire('module-maker');

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
```

## Change Logs

- 1.0.0 init

const fs = require('fs');
const path = require('path');

class ModuleMaker {

    static require(module_name) {

        this._init_class();

        const { Module, required } = this._init_module(module_name);

        return this._wrap(required, Module);
    }

    static _init_class() {

        if (this.__inited__) {
            return;
        }

        this.__inited__ = true;

        this.POINT = '.';
        this.SEPARATOR = '/';

        this.DIRNAME = __dirname;
        this.FILENAME = __filename;

        this.JS = '.js';
        this.JSON = '.json';
        this.MODULE_SUFFIX = [this.JS, this.JSON];

        this.SEMICOLON = ';';
        this.MODULE_JSON = JSON.stringify({});
        this.MODULE_EXPORTS = 'module.exports = ';
        this.MODULE_DEFAULT = 'module.exports = {};';
    }

    static _init_module(origin_name) {

        const Module = {};

        let required = null;
        // 调用方输入的原始字符串
        Module.origin_name = origin_name;
        // 匹配后缀名
        const matcher = /\.(js|json)$/.exec(origin_name);
        // 得到后缀名
        Module.suffix = matcher && matcher.shift() || this.JS;
        // 获取调用方的所在文件
        const invoker = require.main && require.main.filename || this.FILENAME || this.DIRNAME;
        // 获取调用方的所在文件路径
        Module.invoker = path.dirname(invoker);
        // 获取从本当前文件夹，到调用方文件夹的相对路径
        Module.relative = path.relative(this.DIRNAME, Module.invoker);
        // 去掉文件后缀名
        Module.module_name = path.join(Module.relative, Module.origin_name).replace(/\.(js|json)$/, '');

        // 模块引用一直使用相对路径，所以，模块名字起始必须为./
        if (Module.module_name.charAt(0) !== this.POINT) {
            Module.module_name = `./${Module.module_name}`;
        }

        // 不能直接require，否则，即使新建之后，清cache，也会加载失败
        const realpath = path.join(this.DIRNAME, Module.module_name);

        
        if (matcher) {
            // 如果有后缀名，则直接根据后缀名索引
            if (fs.existsSync(`${realpath}${Module.suffix}`)) {
                required = require(`${realpath}${Module.suffix}`);
                return { Module, required };
            }
        } else {
            // 否则，根据目前所支持的所有后缀名进行索引
            for (let suffix of this.MODULE_SUFFIX) {
                if (fs.existsSync(`${realpath}${suffix}`)) {
                    required = require(Module.module_name);
                    return { Module, required };
                }
            }
        }

        if (!matcher && fs.existsSync(Module.module_name) && fs.lstatSync(Module.module_name).isDirectory()) {
            Module.module_name = path.join(Module.module_name, 'index');
            return this._init_module(Module.module_name);
        } else {

            const filename = Module.module_name + Module.suffix;

            Module.absolute = path.resolve(this.DIRNAME, filename);

            const file = fs.openSync(Module.absolute, 'w');

            const content = Module.suffix === this.JS ? this.MODULE_DEFAULT : this.MODULE_JSON;

            fs.writeSync(file, content);

            fs.closeSync(file);

            required = require(`${Module.module_name}${Module.suffix}`);
        }

        return { Module, required };
    }

    static _wrap(required, Module) {

        const self = this;

        // 将路径属性绑定到required上面，暂时先不绑定。
        // if (!required.__MODULE__) {
        //     Object.defineProperty(required, '__MODULE__', {
        //         get () {
        //             return Module;
        //         },
        //         set (key, value) {
        //             return console.log('不允许修改');
        //         },
        //         enumerable: false,
        //         configurable: false
        //     });
        // }
        
        if (!required.save) {
            Object.defineProperty(required, 'save', {
                get () {
                    return function () {
                        return self._save(required, Module);
                    };
                },
                set (value) {
                    throw new Error('ModuleMaker.save属性，不可以被修改');
                },
                enumerable: false,
                configurable: false
            });
        }

        return required;
    }

    static _dump(object = {}, replacer = null, indent = '    ') {
        return JSON.stringify(object || {}, replacer || null, indent);
    }

    static _save(required, Module) {

        const { DIRNAME } = this;

        const { module_name } = Module;

        let filename = path.join(DIRNAME, module_name) + Module.suffix;

        const fileTmpName = `${filename}.tmp`;

        if (fs.existsSync(fileTmpName)) {
            fs.unlinkSync(fileTmpName);
        }

        const fileTmp = fs.openSync(fileTmpName, 'w');

        if (Module.suffix === this.JSON) {
            fs.writeSync(fileTmp, this._dump(required));
        } else {
            fs.writeSync(fileTmp, this.MODULE_EXPORTS);
            fs.writeSync(fileTmp, this._dump(required));
            fs.writeSync(fileTmp, this.SEMICOLON);
        }

        fs.closeSync(fileTmp);

        fs.unlinkSync(filename);
        fs.renameSync(fileTmpName, filename);
    }
}

module.exports = ModuleMaker;

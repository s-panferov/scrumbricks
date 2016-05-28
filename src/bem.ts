interface Settings {
    ns?: string;
    el?: string;
    mod?: string;
    modValue?: string;
}

let is = 'is-';
let space = ' ';
let defaultSettings: Settings = {
    ns: '',
    el: '__',
    mod: '_',
    modValue: '_'
};

interface BemMods {
    [mod: string]: string | boolean | any;
}

type BemMix = string
    | string[]
    | { [ cls: string ]: boolean }
    | { toString(): string }

export interface Block {
    (elem: string, ...mods: BemMods[]): Block;
    (...mods: BemMods[]): Block;

    mix(classes: BemMix): Block;
    toString(): string;
}

export interface BemCn {
    (name: string, ...mod: any[]): Block;
}

/**
 * Simplest mixin helper
 */
function extend(target: any, obj: any) {
    return Object.keys(obj).reduce(function(target, key) {
        let value = obj[key];

        // Shallow copy of array
        if (Array.isArray(value)) {
            value = value.slice();
        }

        target[key] = value;
        return target;
    }, target);
}

/**
 * Shallow copy helper
 */
function copy(obj: any) {
    return extend({}, obj);
}

function split() {
    let classNames = toString.bind(this)();
    return String.prototype.split.apply(classNames, arguments);
}

export function setup(_settings: Settings = defaultSettings): BemCn {
    let settings = Object.assign({}, defaultSettings, _settings);

    /**
     * Converts object with classes to array of strings
     * Example: objectToArray({ color: 'red' }) -> ['', '_color_red']
     *
     * @param {Object} obj { name: 'value' } or { name1: true, name2: false }
     * @param {String} [separator='_'] Separator or prefix
     */
    function objectToArray(obj: any, separator?: string) {
        if (separator === undefined) {
            separator = settings.mod;
        }

        let modValueSeparator = settings.modValue;

        return Object.keys(obj).reduce(function(array, key) {
            let value = obj[key];

            if (!value) {
                return array;
            }

            if (value === true) {
                array.push(separator + key);
            } else {
                // Makes block__elem_{modifierKey}_{modifierValue}
                array.push(separator + key + modValueSeparator + value);
            }

            return array;
        }, []);
    }

    /**
     * Callable block instance
     */
    function callableInstance(): any {
        let args = Array.prototype.slice.call(arguments),
            context = copy(this);

        context = args.reduce(function(context: any, argv: any) {
            if (argv && typeof argv === 'string') {
                context.name = context.name + settings.el + argv;
            }

            if (argv && typeof argv === 'object') {
                context.mods.push(argv);
            }

            return context;
        }, context);

        return factory(context);
    }

    /**
     * Static method toString() for callable instance
     */
    function toString() {
        // Add namespace
        let name = settings.ns + this.name,
            classList = name;

        // Add modifiers
        classList = this.mods.reduce(function(classList: any, modObject: any) {
            let modArray = objectToArray(modObject);

            if (modArray.length) {
                modArray.unshift('');
                classList += modArray.join(space + name);
            }

            return classList;
        }, classList);

        // Mix with another classes
        if (this.mixes.length) {
            classList += space + this.mixes.join(space);
        }

        // Add states
        let states = this.states;
        classList = Object.keys(states).reduce(function(classList, state) {
            return classList += states[state] ? space + is + state : '';
        }, classList);

        return classList;
    }

    /**
     * Static method mix() for callable instance
     * @param {String|Array|Object} className 'class'; ['one', 'two']; {one: true, two: false}
     */
    function mix(className: any) {
        let context = copy(this);
        let classes: string[];

        if (className) {
            if (typeof className === 'function') {
                classes = [className.toString()];
            } else if (typeof className === 'string') {
                classes = [className];
            } else if (Array.isArray(className)) {
                classes = className;
            } else {
                classes = objectToArray(className, '');
            }
            context.mixes = context.mixes.concat(classes);
        }

        return factory(context);
    }

    /**
     * Adds SMACSS-states: https://smacss.com/book/type-state
     * @param {Object} obj State object
     * @return {[type]} [description]
     */
    function state(obj: any) {
        let context = copy(this),
            states = copy(context.states);

        extend(states, obj || {});
        context.states = states;

        return factory(context);
    }

    /**
     * Generator of block-functions
     * @param {Object} context Immutable context of current block
     * @return {Function}
     */
    function factory(context: any) {
        context = extend({
            name: '',
            mods: [],
            mixes: [],
            states: {}
        }, context || {});

        // Whilst JavaScript can't create callable objects with constructors
        let b: any = callableInstance.bind(context);
        b.toString = toString.bind(context);
        b.split = split.bind(context);
        b.mix = mix.bind(context);
        b.state = state.bind(context);

        return b;
    }

    /**
     * Entry point
     * @param {String} name Block name
     * @return {Function}
     */
    function block(name: string) {
        return factory({ name: name });
    }

    return block;
}

const block = setup();
export default block;

// 类型断言
// 类型断言（Type Assertion）可以用来手动指定一个值的类型。
// 语法
// 值 as 类型
// 或
// <类型>值

// 在 tsx 语法（React 的 jsx 语法的 ts 版）中必须使用前者，即 值 as 类型。

// 形如 <Foo> 的语法在 tsx 中表示的是一个 ReactNode，
// 在 ts 中除了表示类型断言之外，也可能是表示一个泛型。


// 类型断言的用途

// 类型断言的常见用途有以下几种：

// 将一个联合类型断言为其中一个类型§
// 之前提到过，当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，
// 我们只能访问此联合类型的所有类型中共有的属性或方法：

interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function getName(animal: Cat | Fish) {
    return animal.name;
}

// 而有时候，我们确实需要在还不确定类型的时候就访问其中一个类型特有的属性或方法，比如：

interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof animal.swim === 'function') {
        return true;
    }
    return false;
}

// index.ts:11:23 - error TS2339: Property 'swim' does not exist on type 'Cat | Fish'.
//   Property 'swim' does not exist on type 'Cat'.
// 上面的例子中，获取 animal.swim 的时候会报错。

// 此时可以使用类型断言，将 animal 断言成 Fish：

interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof (animal as Fish).swim === 'function') {
        return true;
    }
    return false;
}
// 这样就可以解决访问 animal.swim 时报错的问题了。

// 需要注意的是，类型断言只能够「欺骗」TypeScript 编译器，
// 无法避免运行时的错误，反而滥用类型断言可能会导致运行时错误：

interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function swim(animal: Cat | Fish) {
    (animal as Fish).swim();
}

const tom: Cat = {
    name: 'Tom',
    run() { console.log('run') }
};
swim(tom);
// Uncaught TypeError: animal.swim is not a function`

// 上面的例子编译时不会报错，但在运行时会报错：

// Uncaught TypeError: animal.swim is not a function`
// 原因是 (animal as Fish).swim() 这段代码隐藏了 animal 可能为 Cat 的情况
// ，将 animal 直接断言为 Fish 了，
// 而 TypeScript 编译器信任了我们的断言，故在调用 swim() 时没有编译错误。

// 可是 swim 函数接受的参数是 Cat | Fish，一旦传入的参数是 Cat 类型的变量，
// 由于 Cat 上没有 swim 方法，就会导致运行时错误了。

// 总之，使用类型断言时一定要格外小心，尽量避免断言后调用方法或引用深层属性，
// 以减少不必要的运行时错误。


// 将一个父类断言为更加具体的子类§
// 当类之间有继承关系时，类型断言也是很常见的：

class ApiError extends Error {
    code: number = 0;
}
class HttpError extends Error {
    statusCode: number = 200;
}

function isApiError(error: Error) {
    if (typeof (error as ApiError).code === 'number') {
        return true;
    }
    return false;
}

// 上面的例子中，我们声明了函数 isApiError，
// 它用来判断传入的参数是不是 ApiError 类型，
// 为了实现这样一个函数，它的参数的类型肯定得是比较抽象的父类 Error，
// 这样的话这个函数就能接受 Error 或它的子类作为参数了。

// 但是由于父类 Error 中没有 code 属性，
// 故直接获取 error.code 会报错，需要使用类型断言获取 (error as ApiError).code。

// 大家可能会注意到，在这个例子中有一个更合适的方式来判断是不是 ApiError，
// 那就是使用 instanceof：

class ApiError extends Error {
    code: number = 0;
}
class HttpError extends Error {
    statusCode: number = 200;
}

function isApiError(error: Error) {
    if (error instanceof ApiError) {
        return true;
    }
    return false;
}
// 上面的例子中，确实使用 instanceof 更加合适，
// 因为 ApiError 是一个 JavaScript 的类，
// 能够通过 instanceof 来判断 error 是否是它的实例。

// 但是有的情况下 ApiError 和 HttpError 不是一个真正的类，
// 而只是一个 TypeScript 的接口（interface），
// 接口是一个类型，不是一个真正的值，它在编译结果中会被删除，
// 当然就无法使用 instanceof 来做运行时判断了：

interface ApiError extends Error {
    code: number;
}
interface HttpError extends Error {
    statusCode: number;
}

function isApiError(error: Error) {
    if (error instanceof ApiError) {
        return true;
    }
    return false;
}

// index.ts:9:26 - error TS2693: 'ApiError' only refers to a type, 
// but is being used as a value here.

// 此时就只能用类型断言，通过判断是否存在 code 属性，来判断传入的参数是不是 ApiError 了：

interface ApiError extends Error {
    code: number;
}
interface HttpError extends Error {
    statusCode: number;
}

function isApiError(error: Error) {
    if (typeof (error as ApiError).code === 'number') {
        return true;
    }
    return false;
}



// 将任何一个类型断言为 any§
// 理想情况下，TypeScript 的类型系统运转良好，每个值的类型都具体而精确。

// 当我们引用一个在此类型上不存在的属性或方法时，就会报错：

const foo: number = 1;
foo.length = 1;

// index.ts:2:5 - error TS2339: 
// Property 'length' does not exist on type 'number'.

// 上面的例子中，数字类型的变量 foo 上是没有 length 属性的，
// 故 TypeScript 给出了相应的错误提示。
// 这种错误提示显然是非常有用的。
// 但有的时候，我们非常确定这段代码不会出错，比如下面这个例子：

window.foo = 1;

// index.ts:1:8 - error TS2339:
//  Property 'foo' does not exist on type 'Window & typeof globalThis'.

// 上面的例子中，我们需要将 window 上添加一个属性 foo，
// 但 TypeScript 编译时会报错，提示我们 window 上不存在 foo 属性。

// 此时我们可以使用 as any 临时将 window 断言为 any 类型：
// (window as any).foo = 1;

// 在 any 类型的变量上，访问任何属性都是允许的。
// 需要注意的是，将一个变量断言为 any 可以说是解决 TypeScript 中类型问题的最后一个手段。

// 它极有可能掩盖了真正的类型错误，
// 所以如果不是非常确定，就不要使用 as any。

// 上面的例子中，我们也可以通过[扩展 window 的类型（TODO）][]解决这个错误，
// 不过如果只是临时的增加 foo 属性，as any 会更加方便。

// 总之，一方面不能滥用 as any，
// 另一方面也不要完全否定它的作用，我们需要在类型的严格性和开发的便利性之间掌握平衡
// （这也是 TypeScript 的设计理念之一），才能发挥出 TypeScript 最大的价值。

// 将 any 断言为一个具体的类型§
// 在日常的开发中，我们不可避免的需要处理 any 类型的变量，
// 它们可能是由于第三方库未能定义好自己的类型，
// 也有可能是历史遗留的或其他人编写的烂代码，
// 还可能是受到 TypeScript 类型系统的限制而无法精确定义类型的场景。

// 遇到 any 类型的变量时，我们可以选择无视它，任由它滋生更多的 any。

// 我们也可以选择改进它，通过类型断言及时的把 any 断言为精确的类型，
// 亡羊补牢，使我们的代码向着高可维护性的目标发展。

// 举例来说，历史遗留的代码中有个 getCacheData，它的返回值是 any：

function getCacheData(key: string): any {
    return (window as any).cache[key];
}

// 那么我们在使用它时，
// 最好能够将调用了它之后的返回值断言成一个精确的类型，这样就方便了后续的操作：

function getCacheData(key: string): any {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom = getCacheData('tom') as Cat;
tom.run();

// 上面的例子中，我们调用完 getCacheData 之后，立即将它断言为 Cat 类型。
// 这样的话明确了 tom 的类型，后续对 tom 的访问时就有了代码补全，提高了代码的可维护性。

// 类型断言的限制§
// 本小节的前置知识点：[结构类型系统（TODO）][]、[类型兼容性（TODO）][]



// 从上面的例子中，我们可以总结出：

// 联合类型可以被断言为其中一个类型
// 父类可以被断言为子类
// 任何类型都可以被断言为 any
// any 可以被断言为任何类型


// 那么类型断言有没有什么限制呢？是不是任何一个类型都可以被断言为任何另一个类型呢？
// 答案是否定的——并不是任何一个类型都可以被断言为任何另一个类型。
// 具体来说，若 A 兼容 B，那么 A 能够被断言为 B，B 也能被断言为 A。
// 下面我们通过一个简化的例子，来理解类型断言的限制：

interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

let tom: Cat = {
    name: 'Tom',
    run: () => { console.log('run') }
};
let animal: Animal = tom;

// 我们知道，TypeScript 是结构类型系统，
// 类型之间的对比只会比较它们最终的结构，而会忽略它们定义时的关系。

// 在上面的例子中，Cat 包含了 Animal 中的所有属性，
// 除此之外，它还有一个额外的方法 run。
// TypeScript 并不关心 Cat 和 Animal 之间定义时是什么关系，
// 而只会看它们最终的结构有什么关系——所以它与 Cat extends Animal 是等价的：
interface Animal {
    name: string;
}
interface Cat extends Animal {
    run(): void;
}


// 那么也不难理解为什么 Cat 类型的 tom 可以赋值给 Animal 类型的 animal 了
// ——就像面向对象编程中我们可以将子类的实例赋值给类型为父类的变量。

// 我们把它换成 TypeScript 中更专业的说法，即：Animal 兼容 Cat。

// 当 Animal 兼容 Cat 时，它们就可以互相进行类型断言了：

interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

function testAnimal(animal: Animal) {
    return (animal as Cat);
}
function testCat(cat: Cat) {
    return (cat as Animal);
}

// 这样的设计其实也很容易就能理解：

// 允许 animal as Cat 是因为「父类可以被断言为子类」，这个前面已经学习过了
// 允许 cat as Animal 是因为既然子类拥有父类的属性和方法，
// 那么被断言为父类，获取父类的属性、调用父类的方法，就不会有任何问题，
// 故「子类可以被断言为父类」
// 需要注意的是，这里我们使用了简化的父类子类的关系来表达类型的兼容性，
// 而实际上 TypeScript 在判断类型的兼容性时，
// 比这种情况复杂很多，详细请参考[类型的兼容性（TODO)][]章节。

// 总之，若 A 兼容 B，那么 A 能够被断言为 B，B 也能被断言为 A。

// 同理，若 B 兼容 A，那么 A 能够被断言为 B，B 也能被断言为 A。

// 所以这也可以换一种说法：

// 要使得 A 能够被断言为 B，只需要 A 兼容 B 或 B 兼容 A 即可，
// 这也是为了在类型断言时的安全考虑，毕竟毫无根据的断言是非常危险的。

// 综上所述：

// 联合类型可以被断言为其中一个类型
// 父类可以被断言为子类
// 任何类型都可以被断言为 any
// any 可以被断言为任何类型
// 要使得 A 能够被断言为 B，只需要 A 兼容 B 或 B 兼容 A 即可
// 其实前四种情况都是最后一个的特例。




// 类型别名
// 类型别名用来给一个类型起个新名字。

// 简单的例子
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}

// 上例中，我们使用 type 创建类型别名。


// 字符串字面量类型
// 字符串字面量类型用来约束取值只能是某几个字符串中的一个。

// 简单的例子§
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    // do something
}

handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
handleEvent(document.getElementById('world'), 'dblclick'); // 报错，event 不能为 'dblclick'

// index.ts(7,47): error TS2345: 
// Argument of type '"dblclick"' is not assignable to parameter of type 'EventNames'.

// 上例中，我们使用 type 定了一个字符串字面量类型 EventNames，它只能取三种字符串中的一种。

// 注意，类型别名与字符串字面量类型都是使用 type 进行定义。



// 元组
// 数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。

// 元组起源于函数编程语言（如 F#），这些语言中会频繁使用元组。

// 简单的例子§
// 定义一对值分别为 string 和 number 的元组：

let tom: [string, number] = ['Tom', 25];
// 当赋值或访问一个已知索引的元素时，会得到正确的类型：

let tom: [string, number];
tom[0] = 'Tom';
tom[1] = 25;

tom[0].slice(1);
tom[1].toFixed(2);
// 也可以只赋值其中一项：

let tom: [string, number];
tom[0] = 'Tom';
// 但是当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元组类型中指定的项。

let tom: [string, number];
tom = ['Tom', 25];
let tom: [string, number];
tom = ['Tom'];

// Property '1' is missing in type '[string]' but required in type '[string, number]'.
// 越界的元素§
// 当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型：

let tom: [string, number];
tom = ['Tom', 25];
tom.push('male');
tom.push(true);

// Argument of type 'true' is not assignable to parameter of type 'string | number'.



// 枚举
// 枚举（Enum）类型用于取值被限定在一定范围内的场景，
// 比如一周只能有七天，颜色限定为红绿蓝等。

// 简单的例子§
// 枚举使用 enum 关键字来定义：

enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
// 枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射：

enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true

console.log(Days[0] === "Sun"); // true
console.log(Days[1] === "Mon"); // true
console.log(Days[2] === "Tue"); // true
console.log(Days[6] === "Sat"); // true
// 事实上，上面的例子会被编译为：

var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
// 手动赋值§
// 我们也可以给枚举项手动赋值：

enum Days {Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 7); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true
// 上面的例子中，未手动赋值的枚举项会接着上一个枚举项递增。

// 如果未手动赋值的枚举项与手动赋值的重复了，TypeScript 是不会察觉到这一点的：

// enum Days {Sun = 3, Mon = 1, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 3); // true
console.log(Days["Wed"] === 3); // true
console.log(Days[3] === "Sun"); // false
console.log(Days[3] === "Wed"); // true
// 上面的例子中，递增到 3 的时候与前面的 Sun 的取值重复了，
// 但是 TypeScript 并没有报错，导致 Days[3] 的值先是 "Sun"，
// 而后又被 "Wed" 覆盖了。编译的结果是：

var Days;
(function (Days) {
    Days[Days["Sun"] = 3] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
// 所以使用的时候需要注意，最好不要出现这种覆盖的情况。

// 手动赋值的枚举项可以不是数字，
// 此时需要使用类型断言来让 tsc 无视类型检查 (编译出的 js 仍然是可用的)：

enum Days {Sun = 7, Mon, Tue, Wed, Thu, Fri, Sat = <any>"S"};
var Days;
(function (Days) {
    Days[Days["Sun"] = 7] = "Sun";
    Days[Days["Mon"] = 8] = "Mon";
    Days[Days["Tue"] = 9] = "Tue";
    Days[Days["Wed"] = 10] = "Wed";
    Days[Days["Thu"] = 11] = "Thu";
    Days[Days["Fri"] = 12] = "Fri";
    Days[Days["Sat"] = "S"] = "Sat";
})(Days || (Days = {}));
// 当然，手动赋值的枚举项也可以为小数或负数，此时后续未手动赋值的项的递增步长仍为 1：

enum Days {Sun = 7, Mon = 1.5, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 7); // true
console.log(Days["Mon"] === 1.5); // true
console.log(Days["Tue"] === 2.5); // true
console.log(Days["Sat"] === 6.5); // true
// 常数项和计算所得项§
// 枚举项有两种类型：常数项（constant member）和计算所得项（computed member）。

// 前面我们所举的例子都是常数项，一个典型的计算所得项的例子：

enum Color {Red, Green, Blue = "blue".length};
// 上面的例子中，"blue".length 就是一个计算所得项。

// 上面的例子不会报错，但是如果紧接在计算所得项后面的是未手动赋值的项，
// 那么它就会因为无法获得初始值而报错：

enum Color {Red = "red".length, Green, Blue};

// index.ts(1,33): error TS1061: Enum member must have initializer.
// index.ts(1,40): error TS1061: Enum member must have initializer.
// 下面是常数项和计算所得项的完整定义，部分引用自中文手册 - 枚举：

// 当满足以下条件时，枚举成员被当作是常数：

// 不具有初始化函数并且之前的枚举成员是常数。
// 在这种情况下，当前枚举成员的值为上一个枚举成员的值加 1。
// 但第一个枚举元素是个例外。如果它没有初始化方法，那么它的初始值为 0。
// 枚举成员使用常数枚举表达式初始化。
// 常数枚举表达式是 TypeScript 表达式的子集，
// 它可以在编译阶段求值。当一个表达式满足下面条件之一时，它就是一个常数枚举表达式：

// 数字字面量
// 引用之前定义的常数枚举成员（可以是在不同的枚举类型中定义的）
// 如果这个成员是在同一个枚举类型中定义的，可以使用非限定名来引用
// 带括号的常数枚举表达式
// +, -, ~ 一元运算符应用于常数枚举表达式
// +, -, *, /, %, <<, >>, >>>, &, |, ^ 二元运算符，常数枚举表达式做为其一个操作对象。
// 若常数枚举表达式求值后为 NaN 或 Infinity，则会在编译阶段报错
// 所有其它情况的枚举成员被当作是需要计算得出的值。

// 常数枚举§
// 常数枚举是使用 const enum 定义的枚举类型：

const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
// 常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员。

// 上例的编译结果是：

var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
// 假如包含了计算成员，则会在编译阶段报错：

const enum Color {Red, Green, Blue = "blue".length};

// index.ts(1,38): error TS2474: 
// In 'const' enum declarations member initializer must be constant expression.

// 外部枚举§
// 外部枚举（Ambient Enums）是使用 declare enum 定义的枚举类型：

declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
// 之前提到过，declare 定义的类型只会用于编译时的检查，编译结果中会被删除。

// 上例的编译结果是：

var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
// 外部枚举与声明语句一样，常出现在声明文件中。

// 同时使用 declare 和 const 也是可以的：

declare const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
// 编译结果：

var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
// TypeScript 的枚举类型的概念来源于 C#。

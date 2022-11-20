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



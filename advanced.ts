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








// 类
// 传统方法中，JavaScript 通过构造函数实现类的概念，
// 通过原型链实现继承。而在 ES6 中，我们终于迎来了 class。

// TypeScript 除了实现了所有 ES6 中的类的功能以外，还添加了一些新的用法。

// 这一节主要介绍类的用法，下一节再介绍如何定义类的类型。

// 类的概念§
// 虽然 JavaScript 中有类的概念，但是可能大多数 JavaScript 程序员并不是非常熟悉类，
// 这里对类相关的概念做一个简单的介绍。


// 类（Class）：定义了一件事物的抽象特点，包含它的属性和方法

// 对象（Object）：类的实例，通过 new 生成

// 面向对象（OOP）的三大特性：封装、继承、多态

// 封装（Encapsulation）：将对数据的操作细节隐藏起来，
// 只暴露对外的接口。外界调用端不需要（也不可能）知道细节，
// 就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据

// 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性

// 多态（Polymorphism）：由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。比如 Cat 和 Dog 都继承自 Animal，但是分别实现了自己的 eat 方法。此时针对某一个实例，我们无需了解它是 Cat 还是 Dog，就可以直接调用 eat 方法，程序会自动判断出来应该如何执行 eat

// 存取器（getter & setter）：用以改变属性的读取和赋值行为

// 修饰符（Modifiers）：修饰符是一些关键字，用于限定成员或类型的性质。
// 比如 public 表示公有属性或方法

// 抽象类（Abstract Class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。
// 抽象类中的抽象方法必须在子类中被实现

// 接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。
// 接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口

// ES6 中类的用法§
// 下面我们先回顾一下 ES6 中类的用法，更详细的介绍可以参考 ECMAScript 6 入门 - Class。

// 属性和方法§
// 使用 class 定义类，使用 constructor 定义构造函数。

// 通过 new 生成新实例的时候，会自动调用构造函数。

class Animal {
    public name;
    constructor(name) {
        this.name = name;
    }
    sayHi() {
        return `My name is ${this.name}`;
    }
}

let a = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack

// 类的继承§
// 使用 extends 关键字实现继承，子类中使用 super 关键字来调用父类的构造函数和方法。

class Cat extends Animal {
  constructor(name) {
    super(name); // 调用父类的 constructor(name)
    console.log(this.name);
  }
  sayHi() {
    return 'Meow, ' + super.sayHi(); // 调用父类的 sayHi()
  }
}

let c = new Cat('Tom'); // Tom
console.log(c.sayHi()); // Meow, My name is Tom

// 存取器§
// 使用 getter 和 setter 可以改变属性的赋值和读取行为：

class Animal {
  constructor(name) {
    this.name = name;
  }
  get name() {
    return 'Jack';
  }
  set name(value) {
    console.log('setter: ' + value);
  }
}

let a = new Animal('Kitty'); // setter: Kitty
a.name = 'Tom'; // setter: Tom
console.log(a.name); // Jack

// 静态方法§
// 使用 static 修饰符修饰的方法称为静态方法，它们不需要实例化，而是直接通过类来调用：

class Animal {
  static isAnimal(a) {
    return a instanceof Animal;
  }
}

let a = new Animal('Jack');
Animal.isAnimal(a); // true
a.isAnimal(a); // TypeError: a.isAnimal is not a function

// ES7 中类的用法§
// ES7 中有一些关于类的提案，TypeScript 也实现了它们，这里做一个简单的介绍。

// 实例属性§
// ES6 中实例的属性只能通过构造函数中的 this.xxx 来定义，ES7 提案中可以直接在类里面定义：

class Animal {
  name = 'Jack';

  constructor() {
    // ...
  }
}

let a = new Animal();
console.log(a.name); // Jack

// 静态属性§
// ES7 提案中，可以使用 static 定义一个静态属性：

class Animal {
  static num = 42;

  constructor() {
    // ...
  }
}

console.log(Animal.num); // 42

// TypeScript 中类的用法§
// public private 和 protected§
// TypeScript 可以使用三种访问修饰符（Access Modifiers），
// 分别是 public、private 和 protected。

// public 修饰的属性或方法是公有的，
// 可以在任何地方被访问到，默认所有的属性和方法都是 public 的

// private 修饰的属性或方法是私有的，不能在声明它的类的外部访问
// protected 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的
// 下面举一些例子：

class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom';
console.log(a.name); // Tom
// 上面的例子中，name 被设置为了 public，所以直接访问实例的 name 属性是允许的。

// 很多时候，我们希望有的属性是无法直接存取的，这时候就可以用 private 了：

class Animal {
  private name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name);
a.name = 'Tom';

// index.ts(9,13): error TS2341: 
// Property 'name' is private and only accessible within class 'Animal'.
// index.ts(10,1):
//  error TS2341: Property 'name' is private and only accessible within class 'Animal'.
// 需要注意的是，TypeScript 编译之后的代码中，并没有限制 private 属性在外部的可访问性。

// 上面的例子编译后的代码是：

var Animal = (function () {
  function Animal(name) {
    this.name = name;
  }
  return Animal;
})();
var a = new Animal('Jack');
console.log(a.name);
a.name = 'Tom';

// 使用 private 修饰的属性或方法，在子类中也是不允许访问的：

class Animal {
  private name;
  public constructor(name) {
    this.name = name;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
    console.log(this.name);
  }
}

// index.ts(11,17): error TS2341:
//  Property 'name' is private and only accessible within class 'Animal'.

// 而如果是用 protected 修饰，则允许在子类中访问：

class Animal {
  protected name;
  public constructor(name) {
    this.name = name;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
    console.log(this.name);
  }
}

// 当构造函数修饰为 private 时，该类不允许被继承或者实例化：

class Animal {
  public name;
  private constructor(name) {
    this.name = name;
  }
}
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}

let a = new Animal('Jack');

// index.ts(7,19): TS2675:
//  Cannot extend a class 'Animal'. Class constructor is marked as private.
// index.ts(13,9): TS2673:
//  Constructor of class 'Animal' is private and only accessible within the class declaration.

// 当构造函数修饰为 protected 时，该类只允许被继承：

class Animal {
  public name;
  protected constructor(name) {
    this.name = name;
  }
}
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}

let a = new Animal('Jack');

// index.ts(13,9): TS2674:
//  Constructor of class 'Animal' is protected and only accessible within the class declaration.



// 参数属性§
// 修饰符和readonly还可以使用在构造函数参数中，
// 等同于类中定义该属性同时给该属性赋值，使代码更简洁。

class Animal {
  // public name: string;
  public constructor(public name) {
    // this.name = name;
  }
}

// readonly§
// 只读属性关键字，只允许出现在属性声明或索引签名或构造函数中。

class Animal {
  readonly name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom';

// index.ts(10,3): TS2540: Cannot assign to 'name' because it is a read-only property.
// 注意如果 readonly 和其他访问修饰符同时存在的话，需要写在其后面。

class Animal {
  // public readonly name;
  public constructor(public readonly name) {
    // this.name = name;
  }
}


// 抽象类§
// abstract 用于定义抽象类和其中的抽象方法。

// 什么是抽象类？

// 首先，抽象类是不允许被实例化的：

abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

let a = new Animal('Jack');

// index.ts(9,11): error TS2511:
//  Cannot create an instance of the abstract class 'Animal'.

// 上面的例子中，我们定义了一个抽象类 Animal，
// 并且定义了一个抽象方法 sayHi。在实例化抽象类的时候报错了。

// 其次，抽象类中的抽象方法必须被子类实现：

abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

class Cat extends Animal {
  public eat() {
    console.log(`${this.name} is eating.`);
  }
}

let cat = new Cat('Tom');

// index.ts(9,7): error TS2515:
//  Non-abstract class 'Cat' does not implement inherited abstract member 'sayHi' from class 'Animal'.

// 上面的例子中，我们定义了一个类 Cat 继承了抽象类 Animal，
// 但是没有实现抽象方法 sayHi，所以编译报错了。


// 下面是一个正确使用抽象类的例子：

abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

class Cat extends Animal {
  public sayHi() {
    console.log(`Meow, My name is ${this.name}`);
  }
}

let cat = new Cat('Tom');
// 上面的例子中，我们实现了抽象方法 sayHi，编译通过了。

// 需要注意的是，即使是抽象方法，TypeScript 的编译结果中，
// 仍然会存在这个类，上面的代码的编译结果是：

var __extends =
  (this && this.__extends) ||
  function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  };
var Animal = (function () {
  function Animal(name) {
    this.name = name;
  }
  return Animal;
})();
var Cat = (function (_super) {
  __extends(Cat, _super);
  function Cat() {
    _super.apply(this, arguments);
  }
  Cat.prototype.sayHi = function () {
    console.log('Meow, My name is ' + this.name);
  };
  return Cat;
})(Animal);
var cat = new Cat('Tom');


// 类的类型§
// 给类加上 TypeScript 的类型很简单，与接口类似：

class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sayHi(): string {
    return `My name is ${this.name}`;
  }
}

let a: Animal = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack

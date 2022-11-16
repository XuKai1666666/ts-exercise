// Typed JavaScript at Any Scale.
// 添加了类型系统的 JavaScript，适用于任何规模的项目。
// 它强调了 TypeScript 的两个最重要的特性——类型系统、适用于任何规模。
// TypeScript 的特性§
// 类型系统§
// 从 TypeScript 的名字就可以看出来，「类型」是其最核心的特性。
// 安装 TypeScript
// TypeScript 的命令行工具安装方法如下：
// npm install -g typescript
// 编译一个 TypeScript 文件很简单：
// tsc hello.ts
// Hello TypeScript
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = 'Tom';
console.log(sayHello(user));
// 这时候会生成一个编译好的文件 hello.js：
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = 'Tom';
console.log(sayHello(user));

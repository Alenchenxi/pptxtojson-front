// .prettierrc.js
module.exports = {
    // 使用单引号
    singleQuote: true,
    // 语句末尾不加分号 (与您的 'semi': ['error', 'never'] 对应)
    semi: false,
    // 使用 2 个空格进行缩进 (与您的 'indent': ['error', 2] 对应)
    tabWidth: 2,
    // 不适用制表符进行缩进
    useTabs: false,
    // 多行时，在可能的地方加上尾随逗号 (如 es5 模式：对象、数组等)
    trailingComma: 'es5',
    // 行的最大长度
    printWidth: 100,
    // 在对象字面量的括号之间添加空格 (与您的 'bracketSpacing': true 对应)
    bracketSpacing: true,
    // 将多行 HTML（HTML、JSX）元素的 `>` 放在最后一行的末尾
    bracketSameLine: false,
    // 箭头函数参数周围始终加上括号 (与您的 'arrowParens': 'always' 意图类似，Prettier 默认即为 'always')
    arrowParens: 'always',
    // 行尾换行符序列
    endOfLine: 'lf'
}
# ele-table-editor | 基于 element-ui 的表格编辑组件

[![license](https://img.shields.io/npm/l/ele-table-editor.svg)](https://dream2023.github.io/ele-table-editor/)
[![npm](https://img.shields.io/npm/v/ele-table-editor.svg)](https://www.npmjs.com/package/ele-table-editor)
[![download](https://img.shields.io/npm/dw/ele-table-editor.svg)](https://npmcharts.com/compare/ele-table-editor?minimal=true)

![image](https://raw.githubusercontent.com/dream2023/images/master/table-editor.x92q1qonef.gif)

## 特性

> 通过对 el-table-column 增加一个属性 **content**, 实现了如下特性:

- 数据驱动
- 行内编辑
- 输入校检
- 错误展示
- 数据格式化
- 一键禁用

## 安装

```bash
npm install ele-table-editor --save
```

### 用法

```js
import EleTableEditor from 'ele-table-editor'

export default {
  components: {
    EleTableEditor
  }
}
```

## 示例

```html
<template>
  <div style="margin: 50 auto;">
    <div style="margin-bottom: 20px;">
      <el-button type="danger" @click="handleCheck">校检数据</el-button>
    </div>

    <ele-table-editor
      ref="table"
      :extraBtns="extraBtns"
      :rules="rules"
      :columns="columns"
      :newColumnValue="newColumnValue"
      v-model="tableData"
    >
      <!-- 支持插槽 -->
      <template v-slot:sex="{ data }">
        <el-radio-group v-model="data.sex">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </template>
    </ele-table-editor>
  </div>
</template>

<script>
  import EleTableEditor from 'ele-table-editor'
  import { InputNumber } from 'element-ui'
  export default {
    components: {
      EleTableEditor
    },
    data() {
      return {
        // 表格数据
        tableData: [
          {
            grade: '三年级二班',
            name: '小张',
            age: 18,
            sex: '男',
            tuition: 2000,
            unPay: 100
          }
        ],
        // 新增列的默认值
        newColumnValue: { grade: '三年级二班' },
        // 校检规则
        rules: {
          name: { required: true, message: '姓名必填' },
          tuition: { required: true, message: '已缴纳金额必填' }
        },
        // 其它按钮
        extraBtns: [
          {
            // text 按钮显示的文本
            text: '关联',
            // 按钮的属性
            attrs: {
              type: 'text'
            },
            // click事件
            click(scope) {
              console.log(scope)
            }
          }
        ],

        // 表格列
        columns: [
          // el-table-column 的属性 + content 属性
          {
            type: 'index'
          },
          {
            prop: 'grade',
            label: '年级'
          },
          {
            prop: 'name',
            label: '姓名',
            // 当有 content 属性时, 可以指定相应的组件
            content: {
              // type 可以为全局注册的组件名或者组件引用
              type: 'el-input',
              // attrs 是组件的属性
              attrs: {
                placeholder: '学员姓名'
              }
              // 此外还有
              // style: {}, // 组件的样式
              // class: {}, // 组件的class
              // on: {}, // 组件的事件
              // slots:{}, // 插槽
              // scopedSlots: {} // 作用域插槽
            }
          },
          {
            prop: 'sex',
            label: '性别'
          },
          {
            label: '缴费',
            width: 400,
            // content 可以为数组
            content: [
              // 数组可以是 组件 和 普通字符串 混用
              '已缴纳: ',
              {
                type: 'el-input',
                // 当content为数组时, 必须制定组件绑定的 tableData 的 key
                valueKey: 'tuition',
                style: {
                  width: '100px',
                  marginRight: '10px'
                }
              },
              '未缴纳: ',
              {
                type: 'el-input',
                valueKey: 'unPay', // 这里也需要绑定 key
                style: {
                  width: '100px'
                }
              }
            ]
          }
        ]
      }
    },
    methods: {
      // 校检数据
      handleCheck() {
        this.$refs['table'].validate(res => {
          console.log(res)
        })
      }
    }
  }
</script>
```

## Props 参数

### 参数概述

```js
props: {
  // 表格的属性
  tableAttrs: {
    type: Object,
    default: () => ({ border: true })
  },
  // 表格事件
  tableOn: {
    type: Object
  },
  // 表单数据
  value: {
    type: Array,
    default: () => []
  },
  // 是否显示删除
  isShowDelete: {
    type: Boolean,
    default: true
  },
  // 删除按钮属性
  deleteBtnAttr: {
    type: Object,
    default () {
      return {
        type: 'text'
      }
    }
  },
  // 右侧其它按钮
  extraBtns: {
    type: Array,
    default: null
  },
  // table 列
  columns: {
    type: Array,
    default: () => []
  },
  // 校检规则
  rules: Object,
  // 禁用 (对所有input框禁用))
  disabled: {
    type: Boolean,
    default: false
  },
  // 新增列的值
  newColumnValue: {
    type: Object,
    default: () => ({})
  },
  // 是否显示新增按钮
  isShowAdd: {
    type: Boolean,
    default: true
  },
  // 新增按钮文本
  addBtnText: {
    type: String,
    default: '新增'
  }
}
```

### columns 参数详解

```js
columns: {
  // attrs 为 el-table-column 的属性 + content
  // el-table-column 的属性具体参考: https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
  prop: 'name', // el-table-column 的 prop 属性
  label: '姓名', // el-table-column 的 label 属性
  width: 200, // el-table-column 的 width 属性
  // ...
  // column的内容, 可省略, 省略时为显示字符串
  // column 的类型可以为对象或者对象数组, 例如
  content: {
    // 渲染的组件, 可以为全局注册的组件名称或者直接组件的引用
    type: 'el-select',
    // 组件属性
    attrs: {
      size: 'medium',
      // ...
    },
    // 组件样式
    style: {
      width: '200px',
      // ...
    },
    // 组件 class
    class: 'my-custom-select',
    // 组件事件
    on: {
      change(value) {
        console.log(value)
      },
      // ...
    },
    // 组件插槽
    slots: {
      default (h) {
        return [
          h('el-option', { attrs: { label: '男', value: 1 } }),
          h('el-option', { attrs: { label: '女', value: 2 } })
        ]
      }
    },
    // 作用域插槽
    scopedSlots: {
      test (h, data) {
        // data 为传递过来的参数
        return h('div', 'test')
      }
    }
  },
  // ⚠️ 当content为数组时, 必须要指定双向绑定的 valueKey
  // 例如
  content: [
    {
      type: ElInput, // 这里是直接使用组件的引用 import {ElInput} from 'element-ui'
      valueKey: 'name' // 和 tableData 的 name 绑定
    }
    {
      type: 'el-input',
      valueKey: 'age' // 和 tableData 的 age 绑定
    }
  ]
}
```

## 插槽

- `default`: 默认插槽 新增按钮的插槽
- `btn`: 右侧按钮插槽
- `prop`: column 中 prop 属性对应的插槽, 例如示例中 `v-slot:sex` 或者 `v-slot:age` 等

## 相关链接

- [element-ui table 组件](https://element.eleme.cn/#/zh-CN/component/table)

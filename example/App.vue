<template>
  <el-card header="table-editor 示例" style="margin: 50px 20px;">
    <div class="actions">
      <el-button type="danger" @click="handleCheck">校检数据</el-button>
      <el-button>
        <el-link
          href="https://github.com/dream2023/ele-table-editor/blob/master/example/App.vue"
          :underline="false"
          target="_blank"
          >查看示例源码</el-link
        >
      </el-button>
      <el-button>
        <el-link
          href="https://github.com/dream2023/ele-table-editor"
          :underline="false"
          target="_blank"
          >进入 GitHub</el-link
        >
      </el-button>
    </div>
    <!-- ------- ele-table-editor 主体部分 ------- -->
    <ele-table-editor
      ref="table"
      :extraBtns="extraBtns"
      :rules="rules"
      :columns="columns"
      v-model="tableData"
      :newColumnValue="newColumnValue"
    >
      <!-- 支持插槽 -->
      <template v-slot:sex="{ data }">
        <el-radio-group v-model="data.sex">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </template>
    </ele-table-editor>
    <!-- ------- ele-table-editor 主体部分结束 ------- -->

    <!-- 显示数据 -->
    <pre class="code-data"
      >{{ tableData }}
</pre
    >
  </el-card>
</template>

<script>
import EleTableEditor from '../src/EleTableEditor'

export default {
  name: 'App',
  components: {
    EleTableEditor
  },
  data () {
    return {
      // 表格数据
      tableData: [
        {
          grade: '三年级二班',
          name: '小张',
          sex: '男',
          tuition: 2000,
          unPay: 100,
          status: 0,
          dream: ''
        }
      ],
      newColumnValue: {
        grade: '三年级二班',
        status: 1
      },
      // 校检规则
      rules: {
        name: [{ required: true, message: '姓名必填' }],
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
          style: {
            color: '#303133'
          },
          // click事件
          click (scope) {
            /* eslint-disable */
            console.log(scope)
          }
        }
      ],
      // 表格列
      columns: [
        {
          // el-table-column 的属性
          type: 'index'
        },
        {
          // el-table-column 的属性
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
            // on: {} // 组件的事件
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
            '已缴纳: ', // 数组可以是 组件 和 普通字符串 混用
            {
              type: 'el-input',
              valueKey: 'tuition', // 当content为数组时, 必须制定组件绑定的 tableData 的 key
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
        },
        {
          prop: 'dream',
          label: '梦想',
          content: {
            type: 'el-radio-group',
            // 对于 el-select, el-checkbox-group, el-radio-group 三个组件
            // 可以指定  options 数组进行选项的渲染
            options: [
              // option 的值可以为对象
              // 此处对以上三个组件做了封装, 显示的key为 text, 值key为 value
              { text: '科学家', value: 'scientist' },
              { text: '警察', value: 'policeman' },
              // 也可以指定为字符串, 则会转化为 '程序员' => { text: '程序员', value: '程序员' }
              '程序员'
            ]
          }
        },
        {
          prop: 'birthplace',
          label: '籍贯',
          content: {
            type: 'el-select',
            // 如果 key 不是 text 和 value
            // 可以使用 prop 指定 key
            options: [
              { name: '北京', id: 'beijing' },
              { name: '上海', id: 'shanghai' },
              { name: '广州', id: 'guangzhou' }
            ],
            // prop 将 text 对应 name, value 对应 id
            prop: {
              text: 'name',
              value: 'id'
            }
          }
        },
        {
          prop: 'status',
          label: '状态',
          // 通过 options 将枚举值转为文本
          options: {
            0: '禁用',
            1: '正常',
            2: '异常'
          }
        }
      ]
    }
  },
  methods: {
    // 校检数据
    handleCheck() {
      this.$refs['table'].validate().catch(({ errors, fields }) => {
        console.log(errors, fields)
      })
    }
  }
}
</script>

<style>
body {
  background: #f0f2f5;
}
</style>

<style scoped>
.actions {
  margin-bottom: 20px;
}

.code-data {
  background: #f6f6f6;
  padding: 20px;
}
</style>

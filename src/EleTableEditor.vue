<template>
  <div>
    <!-- 新增按钮 -->
    <slot>
      <div v-if="isShowAdd" class="ele-table-editor-btn">
        <el-button type="primary" @click="handleAdd">{{
          addBtnText
        }}</el-button>
      </div>
    </slot>

    <!-- element-ui table 组件 -->
    <el-table
      class="ele-table-editor"
      :data="value"
      v-bind="tableAttrs"
      v-on="tableOn"
    >
      <!-- element-ui table-column组件 -->
      <template v-for="(item, index) of computedColumns">
        <!-- type 非 index / selection -->
        <el-table-column v-if="item.isShowSlot" :key="index" v-bind="item">
          <!-- table-column 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 对外暴露的作用域插槽 -->
            <slot
              :name="item.prop"
              :data="value[scope.$index]"
              :row="scope.row"
              :disabled="disabled"
              :index="scope.$index"
              class="ele-table-editor-content"
            >
              <!-- 判断是否定义了 content 属性 -->
              <template v-if="item.content">
                <template v-for="(contentItem, i) of item.content">
                  <!-- conent 为字符串类型, 直接渲染 span 标签 -->
                  <span :key="i" v-if="typeof contentItem === 'string'">{{
                    contentItem
                  }}</span>
                  <!-- content 为其它类型, 则按照动态组件渲染 -->
                  <!-- 利用 Tooltip 组件作为 [错误] 弹出框-->
                  <el-tooltip
                    effect="dark"
                    v-else
                    :key="i"
                    class="el-form-item"
                    :disabled="
                      !isError(scope.$index, contentItem.valueKey, item.prop)
                    "
                    :class="{
                      'is-error': isError(
                        scope.$index,
                        contentItem.valueKey,
                        item.prop
                      )
                    }"
                    :content="
                      isError(scope.$index, contentItem.valueKey, item.prop)
                    "
                    placement="top"
                  >
                    <!-- 组件 -->
                    <component
                      :is="contentItem.type"
                      :style="contentItem.style"
                      :class="contentItem.class"
                      v-bind="getAttrs(contentItem, scope)"
                      @input="
                        handleChange(
                          contentItem.valueKey || item.prop,
                          scope.$index,
                          $event
                        )
                      "
                      @change="
                        emitChange(
                          contentItem.change,
                          $event,
                          scope.row,
                          scope.$index
                        )
                      "
                      v-model="scope.row[contentItem.valueKey || item.prop]"
                      v-on="contentItem.on"
                    >
                      <!-- 组件的插槽 -->

                      <!-- select, checkbox, radio等简化操作 options -->
                      <template
                        v-slot:default
                        v-if="
                          contentItem.options && optionTypes[contentItem.type]
                        "
                      >
                        <option-slot
                          v-for="(option, index) of contentItem.options"
                          :key="index"
                          :data="option"
                          :prop="contentItem.prop"
                          :optionAttrs="option.attrs"
                          :optionType="optionTypes[contentItem.type].type"
                          :optionText="optionTypes[contentItem.type].text"
                          :optionValue="optionTypes[contentItem.type].value"
                        ></option-slot>
                      </template>
                      <!-- 作用域插槽 -->
                      <template
                        v-for="(render, key) of contentItem.scopedSlots"
                        v-slot:[key]="data"
                      >
                        <extend-slot :data="data" :key="key" :render="render" />
                      </template>

                      <!-- 非作用域插槽 -->
                      <template
                        v-for="(render, key) of contentItem.slots"
                        v-slot:[key]
                      >
                        <extend-slot :key="key" :render="render" />
                      </template>
                    </component>
                  </el-tooltip>
                </template>
              </template>
              <template v-else>
                <!-- 没有定义content则这显示对应的文本值 -->
                <template v-if="item.prop">{{
                  getContentText(scope, item)
                }}</template>
              </template>
            </slot>
          </template>
        </el-table-column>
        <!-- type 为 index / selection -->
        <el-table-column v-else :key="index" v-bind="item"></el-table-column>
      </template>
      <el-table-column
        v-if="isShowActionColumn"
        header-align="center"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <slot v-bind="scope" name="btn">
            <el-button
              v-for="(btn, index) of extraBtns"
              :key="index"
              v-bind="btn.attrs"
              :style="btn.style"
              @click="btn.click(scope)"
              >{{ btn.text }}</el-button
            >
            <el-button
              v-bind="deleteBtnAttr"
              v-if="isShowDelete"
              @click="handleDelete(scope.$index)"
              >删除</el-button
            >
          </slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import validate from './validate'
import ExtendSlot from './ExtendSlot'
import OptionSlot from './OptionSlot'

export default {
  name: 'EleTableEditor',
  mixins: [validate],
  components: { ExtendSlot, OptionSlot },
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
      required: true,
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
      default() {
        return {
          type: 'text',
          style: {
            color: '#F56C6C'
          }
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
      required: true,
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
  },
  computed: {
    // 对 columns 属性做处理
    // 1. 判断是否显示插槽 & 2.将content统一转为数组
    computedColumns() {
      return this.columns
        .filter(item => {
          if (typeof item.vif === 'function') {
            return item.vif(this.value)
          } else if (typeof item.vif === 'undefined') {
            return true
          } else {
            return Boolean(item.vif)
          }
        })
        .map(item => {
          // 是否显示插槽
          Object.defineProperty(item, 'isShowSlot', {
            value: this.isShowSlot(item),
            enumerable: false,
            writable: true,
            configurable: true
          })
          // 将  content 转为数组
          if (item.content) {
            item.content = this.changeToArray(item.content)
          }
          return item
        })
    },
    // 是否显示操作列
    isShowActionColumn() {
      return this.isShowDelete || this.extraBtns
    }
  },
  data() {
    return {
      optionTypes: {
        'el-select': {
          type: 'el-option',
          text: 'label',
          value: 'value'
        },
        'el-checkbox-group': {
          type: 'el-checkbox',
          text: 'content',
          value: 'label'
        },
        'el-radio-group': {
          type: 'el-radio',
          text: 'content',
          value: 'label'
        }
      }
    }
  },
  methods: {
    // 是否展示插槽 (type 为 index 或者 selection时, 不显示插槽)
    isShowSlot(item) {
      return !item.type || !['index', 'selection'].includes(item.type)
    },
    // 删除
    handleDelete(index) {
      const tableData = this.value
      tableData.splice(index, 1)
      this.$delete(this.errorList, index)
      this.$emit('input', tableData)
    },
    // 新增
    handleAdd() {
      this.value.push(Object.assign({}, this.newColumnValue))
      this.$emit('input', this.value)
    },
    // 将数据绑定到 change 函数上
    emitChange(change, val, row, index) {
      if (change) {
        change(val, row, index)
      }
    },
    // 值变化
    handleChange(prop, index, value) {
      this.validateOneValue(prop, index, value)
    },
    // content 支持数组和对象类型
    // 统一转为数组
    changeToArray(content) {
      return Array.isArray(content) ? content : [content]
    },
    // 获取属性 (为了将disabled统一设置)
    getAttrs(item, scope) {
      const attrs =
        typeof item.attrs === 'function'
          ? item.attrs(scope, this.value)
          : item.attrs
      return Object.assign({}, { disabled: this.disabled }, attrs)
    },
    // 获取文本内容
    getContentText(scope, item) {
      let text = scope.row[item.prop]
      // 通过options获取枚举值
      if (item.options && item.options[text]) {
        text = item.options[text]
      }
      // 通过 formatter 获取格式化的值
      if (item.formatter) {
        text = item.formatter(scope.row, scope.column)
      }
      return text
    }
  }
}
</script>

<style>
.ele-table-editor .el-form-item {
  margin-bottom: 0;
  display: inline-block;
}

.ele-table-editor-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.ele-table-editor-btn {
  margin-bottom: 20px;
}
</style>

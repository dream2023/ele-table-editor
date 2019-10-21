<template>
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
      <el-table-column v-if="item.isShowSlot" :key="index" v-bind="item.attrs">
        <!-- table-column 作用域插槽 -->
        <template slot-scope="scope">
          <!-- 对外暴露的作用域插槽 -->
          <slot
            :name="item.attrs.prop"
            :data="value[scope.$index]"
            :row="scope.row"
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
                    !isError(
                      scope.$index,
                      contentItem.valueKey,
                      item.attrs.prop
                    )
                  "
                  :class="{
                    'is-error': isError(
                      scope.$index,
                      contentItem.valueKey,
                      item.attrs.prop
                    )
                  }"
                  :content="
                    isError(scope.$index, contentItem.valueKey, item.attrs.prop)
                  "
                  placement="top"
                >
                  <!-- 组件 -->
                  <component
                    :is="contentItem.type"
                    :style="contentItem.style"
                    :class="contentItem.class"
                    v-bind="getAttrs(contentItem.attrs)"
                    @input="
                      handleChange(
                        contentItem.valueKey || item.attrs.prop,
                        scope.$index,
                        $event
                      )
                    "
                    v-model="scope.row[contentItem.valueKey || item.attrs.prop]"
                    v-on="contentItem.on"
                  >
                    <!-- 组件的插槽 -->

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
              <template v-if="item.attrs && item.attrs.prop">{{
                scope.row[item.attrs.prop]
              }}</template>
            </template>
          </slot>
        </template>
      </el-table-column>
      <!-- type 为 index / selection -->
      <el-table-column v-else :key="index" v-bind="item.attrs">
      </el-table-column>
    </template>
    <el-table-column
      v-if="isShowActionColumn"
      header-align="center"
      align="center"
      label="操作"
    >
      <template slot-scope="scope">
        <el-button
          v-for="(btn, index) of extraBtns"
          :key="index"
          v-bind="btn.attrs"
          @click="btn.click(scope)"
          >{{ btn.text }}</el-button
        >
        <el-button v-bind="deleteBtnAttr" @click="handleDelete(scope.$index)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import validate from './validate'
import ExtendSlot from './ExtendSlot'

export default {
  name: 'EleTableEditor',
  mixins: [validate],
  components: { ExtendSlot },
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
    }
  },
  computed: {
    // 对 columns 参数做处理
    computedColumns () {
      const columns = this.columns
      return columns.map((item) => {
        // 是否显示插槽
        item.isShowSlot = this.isShowSlot(item)
        // 将  content 转为数组
        if (item.content) {
          item.content = this.changeToArray(item.content)
        }
        return item
      })
    },
    // 是否显示操作列
    isShowActionColumn () {
      return this.isShowDelete || this.extraBtns
    }
  },
  methods: {
    // 是否展示插槽 (type 为 index 或者 selection时, 不显示插槽)
    isShowSlot (item) {
      return !item.attrs || !item.attrs.type || !['index', 'selection'].includes(item.attrs.type)
    },
    // 删除
    handleDelete (index) {
      const tableData = this.value
      tableData.splice(index, 1)
      this.$emit('input', tableData)
    },
    // 值变化
    handleChange (prop, index, value) {
      this.validateOneValue(prop, index, value)
    },
    // content 支持数组和对象类型
    // 统一转为数组
    changeToArray (content) {
      return Array.isArray(content) ? content : [content]
    },
    // 获取属性
    getAttrs (attrs) {
      return Object.assign({}, { disabled: this.disabled }, attrs)
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
</style>

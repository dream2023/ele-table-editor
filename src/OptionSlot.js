// 用于处理option插槽
export default {
  name: 'OptionSlot',
  props: {
    // 组件类型
    optionType: {
      type: String,
      required: true
    },
    // options 的 text
    // 在 element-ui 中 checkbox 和 radio 中,text 是放到 content 里面的
    // 例如 <el-checkbox label="这是value">这里是text</el-checkbox>
    // 所以 optionText 存在一个特殊值, content, 其它情况都是 attrs 的属性
    optionText: {
      type: String,
      required: true
    },
    // options 的 value
    optionValue: {
      type: String,
      required: true
    },
    // option 的相关属性
    optionAttrs: Object,
    // 数据
    data: {
      type: [Object, String],
      required: true
    },
    // 值的 text 和 value
    prop: {
      type: Object,
      default: () => ({
        text: 'text',
        value: 'value'
      })
    }
  },
  render (h) {
    let data = this.changeToObject(this.data)
    data = this.changeProp(data, this.prop)
    const config = this.getOptionConfig(this.optionAttrs, this.optionText, this.optionValue, data)
    return h(this.optionType, config.attrs, config.children)
  },
  methods: {
    // 获取配置
    getOptionConfig (customAttrs, textKey, valueKey, data) {
      const attrs = Object.assign({}, customAttrs, { [valueKey]: data['value'] })
      let children = null
      if (textKey === 'content') {
        children = data['text']
      } else {
        attrs[textKey] = data['text']
      }

      return { attrs: { attrs }, children: children }
    },
    // 将字符串转为对象
    // '男' => { 'text': '男', 'value': '男' }
    changeToObject (str) {
      if (typeof str === 'string') {
        return { text: str, value: str }
      } else {
        return str
      }
    },
    // 转对象的key
    // 例如 data: { label: '女', val: 1 }, prop: { text: 'label', value: 'val' }
    // 转换过后: data: { text: '女', value: 1 }
    changeProp (data, prop) {
      if (prop) {
        return { 'text': data[prop.text], 'value': data[prop.value] }
      } else {
        return data
      }
    }
  }
}

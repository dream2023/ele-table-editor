import Schema from 'async-validator'

export default {
  data () {
    return {
      // 错误列表
      errorList: {}
    }
  },
  methods: {
    // 数据校检 (对外暴露)
    validate () {
      // 没有数据 或者 没有校检, 则直接返回 resolve
      if (!this.rules || !this.value.length) return Promise.resolve()

      // 检测单个值, 用于界面提示
      this.validateAllValue()

      // 循环遍历每列数据, 进行校检
      const validator = new Schema(this.rules)
      const validators = this.value.map((item) => {
        return new Promise((resolve, reject) => {
          return validator.validate(item).then(resolve).catch(reject)
        })
      })
      return Promise.all(validators)
    },
    // 检测每一个行的每个值的数据
    validateAllValue () {
      const ruleKeys = Object.keys(this.rules || {})
      this.value.forEach((item, index) => {
        ruleKeys.forEach(async (prop, i) => {
          await this.validateOneValue(prop, index, item[prop])
        })
      })
    },
    // 检测单个数据
    validateOneValue (prop, index, value) {
      return new Promise(async (resolve) => {
        try {
          // 参数校检
          await this.checkValue(prop, value)
          this.handleCheckSuccess(prop, index)
          resolve(true)
        } catch (errors) {
          // 处理错误
          this.handleCheckError(prop, index, errors)
          resolve(false)
        }
      })
    },
    // 数据校检
    checkValue (prop, value) {
      return new Promise((resolve, reject) => {
        // 如果校检规则存在, 且当前字段的校检规则存在
        if (this.rules && this.rules[prop]) {
          const validator = new Schema({ [prop]: this.rules[prop] })
          validator.validate({ [prop]: value }, (errors, fields) => {
            if (errors) {
              reject(errors, fields)
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    },
    // 检查通过
    // 重置 errorList 的值
    handleCheckSuccess (prop, index) {
      if (this.errorList[index] && this.errorList[index][prop]) {
        this.errorList[index][prop] = null
      }
    },
    // 处理错误, 将错误拼接字符串, 并保存在 errorList 中
    handleCheckError (prop, index, errors) {
      if (!this.errorList[index]) {
        this.$set(this.errorList, index, {})
      }
      this.$set(this.errorList[index], prop, errors.map((item) => item.message).join(','))
    },
    // 判断是否出错
    // 用于加 class 样式和 tooltip 的 disabled 属性
    isError (index, valueKey, prop) {
      return this.errorList &&
        this.errorList[index] &&
        this.errorList[index][valueKey || prop]
    }
  }
}

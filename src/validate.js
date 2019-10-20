import Schema from 'async-validator'

export default {
  data () {
    return {
      errorList: {}
    }
  },
  methods: {
    // 数据校检
    validate () {
      // 检测单个值, 用于界面提示
      this.validateAllValue()

      // 没有数据 或者 没有校检, 则直接返回 resolve
      if (!this.rules || !this.value.length) return Promise.resolve()

      // 数组的校检, 利用 Promise.all
      const validators = this.value.map((item) => {
        return new Promise((resolve, reject) => {
          var validator = new Schema(this.rules)
          validator.validate(item, (errors) => {
            if (errors) {
              reject(errors)
            } else {
              resolve()
            }
          })
        })
      })
      return new Promise((resolve, reject) => {
        Promise.all(validators).then((res) => {
          resolve()
        }).catch((error) => {
          reject(error)
        })
      })
    },
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
        if (this.rules && this.rules[prop]) {
          const validator = new Schema({ [prop]: this.rules[prop] })
          validator.validate({ [prop]: value }, (errors, fields) => {
            if (errors) {
              reject(errors)
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
    handleCheckSuccess (prop, index) {
      if (this.errorList[index] && this.errorList[index][prop]) {
        this.errorList[index][prop] = null
      }
    },
    // 处理错误
    handleCheckError (prop, index, errors) {
      if (!this.errorList[index]) {
        this.$set(this.errorList, index, {})
      }
      this.$set(this.errorList[index], prop, errors.map((item) => item.message).join(','))
    },
    // 判断是否出错
    isError (index, valueKey, prop) {
      return this.errorList &&
        this.errorList[index] &&
        this.errorList[index][valueKey || prop]
    }
  }
}

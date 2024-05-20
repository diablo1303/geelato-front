export default {
  props: {
    blockItems: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // subBlockItems: []
      emptyHtml: '&nbsp',
      // px
      contentMinHeight: 14 * 3,
      contentMinWidth: 14 * 10,
      contentStyle: {
        'min-height': this.contentMinHeight + 'px',
        'min-width': this.contentMinWidth + 'px'
      }
    }
  },
  mounted() {
    this.$emit('resize', {type: 'increaseHeight', value: undefined})
  },
  destroyed() {
    this.$emit('resize', {type: 'reduceHeight', value: undefined})
  },
  methods: {
    onBlockAdd(e) {
    },
    onBlockEnd(e) {
    },
    onBlockChange(e) {
    },
    onBlockClone(e) {
    },
    getSubScriptText() {
      let scriptText = ''
      // for (let key in this.$refs) {
      //   console.log(this.name + ' > this.$refs[key]>', key, key.startsWith('_'), this.$refs[key])
      //   if (key.startsWith('_')) {
      //     if (this.$refs[key].length !== undefined) {
      //       if (this.$refs[key].length > 0) {
      //         scriptText += this.$refs[key][0].getScriptText()
      //       }
      //     } else {
      //       scriptText += this.$refs[key].getScriptText()
      //     }
      //   }
      // }
      for (let index in this.blockItems) {
        let block = this.blockItems[index]
        let ref = this.$refs['_' + block.name + '_' + index]
        if (ref.length) {
          console.log('getSubScriptText > ref:', ref)
          scriptText += ref[0].getScriptText()
        } else {
          console.warn('getSubScriptText > ref:', ref)
        }
      }

      return scriptText
    },
    reduceHeight() {
      // console.log('reduceHeight>>', this._uid, this)
      // if (this.$refs.glBlockBarLink && this.$refs.glBlockMain) {
      //   console.log('reduceHeight > this.$refs.glBlockMain.$el>', this.$refs.glBlockBarLink, this.$refs.glBlockMain.offsetHeight, this.$refs.glBlockBarLink.offsetHeight)
      //   this.$refs.glBlockBarLink.style.height = (this.$refs.glBlockMain.offsetHeight) + 'px'
      // }
    },
    increaseHeight() {
      // console.log('increaseHeight>>', this._uid, this)
      // if (this.$refs.glBlockBarLink && this.$refs.glBlockMain) {
      //   console.log('reduceHeight > this.$refs.glBlockMain.$el>', this.$refs.glBlockBarLink, this.$refs.glBlockMain.offsetHeight, this.$refs.glBlockBarLink.offsetHeight)
      //   this.$refs.glBlockBarLink.style.height = (this.$refs.glBlockMain.offsetHeight) + 'px'
      // }
    },
    resize(data) {
      // console.log('resize>>', data, this._uid, this)
      // if (data.type == 'increaseHeight') {
      //   this.increaseHeight()
      // } else {
      //   this.reduceHeight()
      // }
      // this.$emit('resize', data)
    }
  }
}

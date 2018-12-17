import Vue from 'vue'

// 拖动指令
Vue.directive('drag', {
  // 当绑定的元素插入到 DOM 时调用此函数……
  bind: function (el) {
    el.style.position = 'absolute'
    el.style.cursor = 'pointer'
    el.style['z-index'] = '10'
    var currX = 0;
    var currY = 0;
     el.addEventListener('mousedown',function(e){
        currX =   e.clientX - el.offsetLeft;
        currY =   e.clientY - el.offsetTop;
       document.addEventListener('mousemove',move)
     })
    el.addEventListener('mouseup',function(e){
      document.removeEventListener('mousemove',move)
    })
    function move(e){
      e.preventDefault()
      el.style.left = e.clientX - currX + 'px';
      el.style.top = e.clientY - currY + 'px';
     }
  }
})

// 数字输入框
Vue.directive('number-input', {
    // 当绑定的元素插入到 DOM 时调用此函数……
    bind: function (el) {
      el.addEventListener('keyup', function (e) {
        if (this.value.length == 1) {
          this.value = this.value.replace(/[^1-9]/g, '')
        } else {
          this.value = this.value.replace(/\D/g, '')
        }
      })
      el.addEventListener('afterpaste', function (e) {
        if (this.value.length == 1) {
          this.value = this.value.replace(/[^1-9]/g, '')
        } else {
          this.value = this.value.replace(/\D/g, '')
        }
      })
    }
  })
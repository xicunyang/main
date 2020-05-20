<template>
  <div id="main">
    主应用外层区
    <br>
    <button @click="changeView('/one')">子应用one</button>
    &nbsp;
    <button @click="changeView('/two')">子应用two</button>
    <br>
    <button @click="changeState('1')">修改state = 1</button>
    &nbsp;
    <button @click="changeState('2')">修改state = 2</button>
    <hr>
    子应用内容区：
    <div id="micro-view"></div>
    <hr>
    显示信息区
    <div class="show-msg-wrap">
      <span v-show="showCursor">_</span><br>
      <div ref="showMsg" id="show-msg" v-html="showMsg"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      showMsg: '',
      showCursor: false,
    }
  },
  mounted() {

    this.$pager.subscribe(v => {
      let oldValue = this.showMsg
      let newValue = v.from+':  &nbsp;'+v.showMsg + '<br>'

      this.showMsg = newValue + oldValue
    })

    // this.$actions.onGlobalStateChange((state,prev)=>{
    //   if(state.showMsg === prev.showMsg && state.showMsg !== '主子应用通讯成功') return
    //   let oldValue = this.showMsg
    //   let newValue = state.showMsg + '<br>'
    //
    //   this.showMsg = newValue + oldValue
    // })

    // 闪烁
    let timer = setInterval(()=>{
      // 闪烁
      this.showCursor = !this.showCursor
    },500)
    this.$once('hock:beforeDestory',function () {
      clearInterval(timer)
    })
  },
  methods: {
    changeView(who){
      window.history.pushState(null,who,who)
    },
    changeState(value){
      this.$actions.setGlobalState({
        mt: value
      });
    }
  }
}
</script>

<style>
#main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
button{
  border: 1px solid rgba(100,100,100,1);
}
  #micro-view{
    height: 200px;
    overflow-y: scroll;
    border: 1px solid rgba(100,100,100,1);
  }
  .show-msg-wrap{
    text-align: left;
    padding: 10px;
    font-size: 15px;
    background-color: rgba(50,50,50,1);
    color: white;
    border: 1px solid rgba(100,100,100,1);
  }
</style>

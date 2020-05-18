import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 导入qiankun
import {
    registerMicroApps, // 注册子应用
    runAfterFirstMounted, // 当地一个子应用装载完毕
    setDefaultMountApp, // 设置默认装载的子应用
    initGlobalState, // 微前端之间的通信
    start, // 启动
} from 'qiankun'

let app = null

function render({appContetnt} = {}) {
    if (!app) {
        // 新建app
        console.log('新建app渲染');
        app = new Vue({
            el: '#container',
            data() {
                return {
                    content: appContetnt
                }
            },
            render(h) {
                return h(App, {
                    props: {
                        content: this.content
                    }
                })
            }
        })
    } else {
        // 已有app
        console.log('已有app渲染');
        app.content = appContetnt
    }
}

// 渲染主应用
render()

// 注册子应用
registerMicroApps([
        {
            name: 'one',
            entry: '//118.25.194.49/:6661',
            container: '#micro-view',
            activeRule: '/one',
            props: {
                msg: {
                    data: {
                        mt: 'you are one'
                    }
                },
                fn:{
                    show(msg){
                        console.log('one:',msg);
                    }
                }
            }
        },
        {
            name: 'two',
            entry: '//118.25.194.49/:6662',
            container: '#micro-view',
            activeRule: '/two',
            props: {
                msg: {
                    data: {
                        mt: 'you are two'
                    }
                },
                fn:{
                    show(msg){
                        console.log('two:',msg);
                    }
                }
            }
        }
    ],
    {
        beforeLoad: [
            app => {
                console.log('beforeLoad');
            }
        ],
        beforeMount: [
            app => {
                console.log('beforeMount');
            }
        ],
        beforeUnmount: [
            app => {
                console.log('beforeUnmount');
            }
        ],
        afterUnmount: [
            app => {
                console.log('afterUnmount');
            }
        ]
    })

// 通讯
const actions = initGlobalState({
    mt: 'init'
})
actions.onGlobalStateChange((state,prev)=>{
    console.log('main state change',state);
})
Vue.prototype.$actions = actions

setDefaultMountApp('one')

// 第一个子应用加载完毕后回调
runAfterFirstMounted(()=>{
  console.log('第一个子应用加载完毕后的回调');
})

// 启动微前端
start()

// new Vue({
//   render: function (h) { return h(App) },
// }).$mount('#app')

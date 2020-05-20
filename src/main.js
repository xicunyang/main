import Vue from 'vue'
import App from './App.vue'
import { Subject } from "rxjs"

Vue.config.productionTip = false


// 使用rxjs通讯
const pager = new Subject();
Vue.prototype.$pager = pager

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

// 通讯
const actions = initGlobalState({
    showMsg: ''
})
Vue.prototype.$actions = actions

// 注册子应用
registerMicroApps([
        {
            name: 'one',
            entry: '//localhost:6661',
            container: '#micro-view',
            activeRule: '/one',
            props: {
                msg: {
                    data: {
                        mt: 'you are one'
                    },
                    pager
                },
                fn:{
                    show(msg){
                        pager.next({
                            from: "one",
                            showMsg: msg
                        });
                    }
                }
            }
        },
        {
            name: 'two',
            entry: '//localhost:6662',
            container: '#micro-view',
            activeRule: '/two',
            props: {
                msg: {
                    data: {
                        mt: 'you are two'
                    },
                    pager
                },
                fn:{
                    show(msg){
                        pager.next({
                            from: "two",
                            showMsg: msg
                        });
                    }
                }
            }
        }
    ],
    {
        beforeLoad: [
            app => {
                pager.next({
                    from: "main",
                    showMsg: "beforeLoad"
                });
            }
        ],
        beforeMount: [
            app => {
                pager.next({
                    from: "main",
                    showMsg: "beforeMount"
                });
            }
        ],
        beforeUnmount: [
            app => {
                pager.next({
                    from: "main",
                    showMsg: "beforeUnmount"
                });
            }
        ],
        afterUnmount: [
            app => {
                pager.next({
                    from: "main",
                    showMsg: "afterUnmount"
                });
            }
        ]
    })

setDefaultMountApp('one')

// 第一个子应用加载完毕后回调
runAfterFirstMounted(()=>{
    pager.next({
        from: "main",
        showMsg: "第一个子应用加载完毕后回调"
    });
})

// 渲染主应用
render()

// 启动微前端
start()

// new Vue({
//   render: function (h) { return h(App) },
// }).$mount('#app')

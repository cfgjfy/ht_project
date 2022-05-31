import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import store from '@/store/index'
// 清除默认样式
import '@/assets/styles/global.css'
import '@/assets/styles/reset.css'
import '@/assets/fonts/iconfont.css'

import '@/plugin/element'
import '@/permission'

import TreeTable from 'vue-table-with-tree-grid'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false


new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')

import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from './utils/auth'

const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const token = getToken()
    if (token) {
        // 如果token存在，去的是登录界面，跳转到首页
        if (to.path === '/login') {
            next('/')
        } else {
            next()
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
        }
    }
    NProgress.done()
})
// 后置路由守卫
router.afterEach(() => {
    NProgress.done()
})

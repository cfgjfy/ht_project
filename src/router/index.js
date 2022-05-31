import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件
const Login = () => import('@/view/Login.vue')
const Home = () => import('@/view/Home.vue')
const Welcome = () => import('@/view/welcome')
const UserList = () => import('@/view/UserList/index')
const RolesList = () => import('@/view/AuthorityManagement/roles')
const Rights = () => import('@/view/AuthorityManagement/rights')
const Goods = () => import('@/view/GoodsManagement/goods')
const AddGoods = () => import('@/view/GoodsManagement/AddGoods')
const Params = () => import('@/view/GoodsManagement/params')
const Categories = () => import('@/view/GoodsManagement/categories')
const Orders = () => import('@/view/OrderManagement/orders')
const Reports = () => import('@/view/DataStatistics/reports')

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/login', component: Login },
        {
            path: '/', redirect: '/users', component: Home,
            children: [
                // { path: '', component: Welcome },
                { path: 'users', component: UserList },
                { path: 'roles', component: RolesList },
                { path: 'rights', component: Rights },
                { path: 'goods', component: Goods, },
                { path: 'params', component: Params },
                { path: 'categories', component: Categories },
                { path: 'orders', component: Orders },
                { path: 'reports', component: Reports },
                { path: 'goods/add', component: AddGoods }
            ]
        },
        {
            path: '/404',
            component: () => import('@/view/404.vue'),
            hidden: true
        },
        { path: '*', redirect: '/404', hidden: true }
    ],
})

// 路由守卫
// 如果用户没有登录的话禁止访问首页
router.beforeEach((to, from, next) => {
    // console.log('to', to)
    if (to.fullPath === '/home') {
        let token = localStorage.getItem('shop_ht')
        if (!token) return false
    }
    next()
})

export default router

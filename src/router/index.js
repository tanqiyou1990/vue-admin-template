import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/me',
    component: Layout,
    redirect: '/me/profile',
    children: [{
      path: 'profile',
      name: 'Profile',
      component: () => import('@/views/me/profile'),
      meta: { title: '个人资料', icon: 'user' },
      hidden: true
    }]
  },

  {
    path: '/news',
    component: Layout,
    redirect: '/news/list',
    name: 'News',
    meta: { title: '新闻管理', icon: 'news_ico' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/news/list'),
        meta: { title: '新闻列表', icon: 'list_ico' }
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/news/form'),
        meta: { title: '新闻编辑', icon: 'form' },
        hidden: true
      }
    ]
  },

  // {
  //   path: '/cms',
  //   component: Layout,
  //   // redirect: '/news/list',
  //   name: 'Cms',
  //   meta: { title: '内容管理', icon: 'text' },
  //   children: [
  //     {
  //       path: 'about',
  //       name: 'About',
  //       component: () => import('@/views/cms/about/form'),
  //       meta: { title: '关于我们', icon: 'about_us' }
  //     },
  //     {
  //       path: 'footer',
  //       name: 'Footer',
  //       component: () => import('@/views/cms/footer/index'),
  //       meta: { title: '底部', icon: 'footer' }
  //     },
  //     {
  //       path: 'homepage1',
  //       name: 'Homepage1',
  //       component: () => import('@/views/cms/home/module1'),
  //       meta: { title: '首页模块1', icon: 'home' }
  //     },
  //     {
  //       path: 'homepage2',
  //       name: 'Homepage2',
  //       component: () => import('@/views/cms/home/module2'),
  //       meta: { title: '首页模块2', icon: 'home' }
  //     },
  //     {
  //       path: 'homepage3',
  //       name: 'Homepage3',
  //       component: () => import('@/views/cms/home/module3'),
  //       meta: { title: '首页模块3', icon: 'home' }
  //     },
  //     {
  //       path: 'homepage4',
  //       name: 'Homepage4',
  //       component: () => import('@/views/cms/home/module4'),
  //       meta: { title: '首页模块4', icon: 'home' }
  //     } 

  //   ]
  // },  
  
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

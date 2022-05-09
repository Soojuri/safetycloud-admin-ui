import Layout from '@/page/index/'

export default [{
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [{
      path: 'index',
      name: '个人信息',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/views/admin/user/info')
    }]
  },
  {
    path: '/app/camera/space/info/',
    component: Layout,
    children: [{
      path: 'index',
      name: '空间目录详情',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/views/app/camera/space/info.vue')
    }]
  },
  {
    path: '/app/event/manual/info/',
    component: Layout,
    children: [{
      path: 'index',
      name: '事件详情',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/views/app/event/manual/info.vue')
    }]
  },
  {
    path: '/app/camera/videoDevice/info/',
    component: Layout,
    children: [{
      path: 'index',
      name: '视频设备详情',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/views/app/camera/videoDevice/info.vue')
    }]
  }, {
    path: '/app/algorithm/bag/details/',
    component: Layout,
    children: [{
      path: 'index',
      name: '算法分类管理详情',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/views/app/algorithm/bag/details.vue')
    }]
  }, {
    path: '/app/algorithm/manage/details/',
    component: Layout,
    children: [{
      path: 'index',
      name: '算法模型详情',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/views/app/algorithm/manage/details.vue')
    }]
  }, {
    path: '/app/algorithm/order/details/',
    component: Layout,
    children: [{
      path: 'index',
      name: '算法订单管理详情',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/views/app/algorithm/order/details.vue')
    }]
  }, {
    path: '/app/task/opera/info/',
    component: Layout,
    children: [{
      path: 'index',
      name: '任务作业详情',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/views/app/task/opera/info.vue')
    }]
  }, {
    path: '/app/camera/gbChannel/channels/',
    component: Layout,
    children: [{
      path: 'index',
      name: '国标通道列表',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/views/app/camera/gbChannel/channels/index.vue')
    }]
  }, {
    path: '/app/edge/node/info/',
    component: Layout,
    children: [{
      path: 'index',
      name: '边缘节点详情',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/views/app/edge/node/info.vue')
    }]
  }, {
    path: '/app/rules/subscribe/record/',
    component: Layout,
    children: [{
      path: 'index',
      name: '订阅记录',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/views/app/rules/subscribe/record.vue')
    }]
  },
  {
    path: '/example-db',
    name: '静态页面-数据大屏',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/index/example-db.vue'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/chemical',
    name: '全国危险化学企业',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/views/ybd-dashboard/chemical'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/coal',
    name: '煤矿企业安全画像概览',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/views/ybd-dashboard/coal'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/safe-prod',
    name: '安全生产数据',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/views/ybd-dashboard/safe-prod'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
]

const routes = [
  {
    path: '/',
    meta: { 
      requiresAuth: false,
      licenseType: [101, 102, 103],
    }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
    component: () => import('layouts/Login.vue'),
  },
  {
    path: '/login',
    meta: { 
      requiresAuth: false,
      licenseType: [101, 102, 103]
    }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
    component: () => import('layouts/Login.vue'),
  },
  {
    path: '/mainmenu',
    component: () => import('layouts/mainmenu/mainmenu-tabbed.vue'),
    children: [
      { path: 'globalSettings', meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/GlobalSettings.vue') },
      {
        path: 'factorySetting',meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/ConfigModule/ApplicationConfig/FactorySetting.vue'),
      },
      {
        path: 'eqptGroup',meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/ConfigModule/ApplicationConfig/EqptGroup.vue'),
      },
      {
        path: 'equipmentBasicInfoSetting',meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () =>
          import('src/pages/ConfigModule/EqptNetConfig/EquipmentBasicInfoSetting.vue'),
      },
      {
        path: 'eqptSession',meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/ConfigModule/ApplicationConfig/EqptSession.vue'),
      },
      {
        path: 'workshopData',meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/ConfigModule/EqptNetConfig/WorkshopData.vue'),
      },
      {
        path: 'eqptContentRouterSetting',meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/ConfigModule/EqptNetConfig/EqptContentRouter.vue'),
      },
      {
        path: 'taskCenterSetting',meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/ConfigModule/EqptNetConfig/TaskCenter.vue'),
      },
      {
        path: 'dataCollectorSetting',meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/ConfigModule/DataCollectorConfig/DataCollector.vue'),
      },
      { 
        path: 'transactionRecord', 
        meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/TransactionRecord.vue') },
      { 
        path: 'transactionInquiry', 
        meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/mainmenu/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/TransactionInquiry.vue') },
      {
        path: 'equipmentMonitoringRealTime',
        meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/EquipmentMonitoring/EquipmentMonitoringRealTime.vue'),
      },
      { 
        path: 'authority', 
        meta: { 
          requiresAuth: true,
          licenseType: [101,102,103],
          directPath: { path: '/transactionRecord' }
        }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
        component: () => import('src/pages/Management/Authority.vue') },
    ],
  },
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
]

export default routes

/**
 * InterviewCoach - 程序员面试准备小程序
 * 应用入口文件
 */

// 引入全局配置
const config = require('./config/index.js')

App({
  globalData: {
    userInfo: null,
    hasLogin: false,
    // API基础配置
    apiBaseUrl: config.API_BASE_URL,
    // 面试题题库配置
    questionBank: {
      languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C++'],
      frameworks: ['React', 'Vue', 'Angular', 'Node.js', 'Spring Boot', 'Django'],
      databases: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'],
      tools: ['Git', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux'],
      concepts: ['数据结构', '算法', '设计模式', '系统设计', '网络协议', '操作系统']
    },
    // 难度级别
    difficultyLevels: ['初级', '中级', '高级', '专家']
  },

  onLaunch(options) {
    console.log('InterviewCoach 小程序启动', options)
    
    // 初始化云开发（可选）
    if (wx.cloud) {
      wx.cloud.init({
        env: config.CLOUD_ENV,
        traceUser: true
      })
    }

    // 检查登录状态
    this.checkLoginStatus()
  },

  onShow(options) {
    console.log('小程序显示', options)
  },

  onHide() {
    console.log('小程序隐藏')
  },

  onError(err) {
    console.error('小程序错误:', err)
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.hasLogin = true
    }
  },

  // 设置用户信息
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    this.globalData.hasLogin = true
    wx.setStorageSync('userInfo', userInfo)
  },

  // 获取用户信息
  getUserInfo() {
    return this.globalData.userInfo
  },

  // 显示加载提示
  showLoading(title = '加载中...') {
    if (wx.showLoading) {
      wx.showLoading({
        title,
        mask: true
      })
    }
  },

  // 隐藏加载提示
  hideLoading() {
    if (wx.hideLoading) {
      wx.hideLoading()
    }
  },

  // 显示成功提示
  showSuccess(title = '成功') {
    wx.showToast({
      title,
      icon: 'success',
      duration: 2000
    })
  },

  // 显示错误提示
  showError(title = '出错了') {
    wx.showToast({
      title,
      icon: 'none',
      duration: 2000
    })
  }
})

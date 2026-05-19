// pages/index/index.js
const app = getApp()

Page({
  data: {
    tips: [
      '面试前务必了解公司背景和岗位要求',
      '准备一个简洁有力的自我介绍',
      '遇到不会的问题，坦诚承认比胡编乱造更好',
      '可以主动展示自己的项目经验和技术思考',
      '面试是双向选择，保持自信但不要傲慢'
    ],
    statistics: {
      totalInterviews: 0,
      totalQuestions: 0,
      practicedToday: 0
    }
  },

  onLoad() {
    this.loadStatistics()
  },

  onShow() {
    this.loadStatistics()
  },

  // 加载统计数据
  loadStatistics() {
    const history = wx.getStorageSync('interviewHistory') || []
    const today = new Date().toDateString()
    const practicedToday = history.filter(item => 
      new Date(item.date).toDateString() === today
    ).length

    this.setData({
      statistics: {
        totalInterviews: history.length,
        totalQuestions: history.reduce((sum, item) => sum + (item.questions?.length || 0), 0),
        practicedToday
      }
    })
  },

  // 导航到JD输入页面
  navigateToJDInput() {
    wx.navigateTo({
      url: '/pages/jd-input/jd-input'
    })
  },

  // 导航到历史页面
  navigateToHistory() {
    wx.switchTab({
      url: '/pages/history/history'
    })
  },

  // 显示帮助
  showHelp() {
    wx.showModal({
      title: '使用帮助',
      content: '1. 在"输入JD"页面粘贴招聘要求\n2. 系统将自动解析并生成面试题\n3. 开始模拟面试练习\n4. 查看历史记录回顾学习',
      confirmText: '我知道了',
      showCancel: false
    })
  },

  // 快速开始
  quickStart() {
    // 使用默认技术栈开始面试
    const defaultJD = '招聘高级前端开发工程师，要求熟练掌握React/Vue，熟悉TypeScript，有大型项目经验'
    wx.setStorageSync('currentJD', defaultJD)
    
    wx.navigateTo({
      url: '/pages/interview/interview?mode=quick'
    })
  },

  // 浏览题库
  browseQuestions() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 查看统计
  viewStatistics() {
    const stats = this.data.statistics
    wx.showModal({
      title: '面试统计',
      content: `总面试次数: ${stats.totalInterviews}\n练习题目: ${stats.totalQuestions}\n今日练习: ${stats.practicedToday}`,
      showCancel: false
    })
  },

  // 分享小程序
  shareApp() {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})

// pages/result/result.js

// 引入服务
const { parseJD } = require('../../services/jd-parser.js')

Page({
  data: {
    report: {
      date: '',
      position: '',
      completionRate: 0,
      completedQuestions: 0,
      totalQuestions: 0,
      totalTime: '0分钟',
      skills: {},
      questions: []
    },
    expandedQuestions: {}
  },

  onLoad(options) {
    const interviewId = options.id
    
    if (interviewId) {
      this.loadReport(interviewId)
    } else {
      this.loadLatestReport()
    }
  },

  // 加载报告
  loadReport(id) {
    const history = wx.getStorageSync('interviewHistory') || []
    const interview = history.find(item => item.id === parseInt(id))
    
    if (interview) {
      this.generateReport(interview)
    } else {
      wx.showToast({
        title: '报告不存在',
        icon: 'none'
      })
      wx.navigateBack()
    }
  },

  // 加载最新报告
  loadLatestReport() {
    const history = wx.getStorageSync('interviewHistory') || []
    
    if (history.length > 0) {
      this.generateReport(history[0])
    } else {
      wx.showToast({
        title: '暂无报告',
        icon: 'none'
      })
      wx.navigateBack()
    }
  },

  // 生成报告数据
  generateReport(interview) {
    const { questions = [], jdText, totalTime, date } = interview
    
    // 解析JD
    const jdParsed = parseJD(jdText)
    
    // 计算完成率
    const completedQuestions = questions.filter(q => q.status === 'completed').length
    const completionRate = questions.length > 0 
      ? Math.round((completedQuestions / questions.length) * 100) 
      : 0

    // 格式化日期
    const reportDate = new Date(date)
    const dateStr = `${reportDate.getFullYear()}年${reportDate.getMonth() + 1}月${reportDate.getDate()}日 ${reportDate.getHours().toString().padStart(2, '0')}:${reportDate.getMinutes().toString().padStart(2, '0')}`

    // 格式化时长
    const hours = Math.floor(totalTime / 3600)
    const minutes = Math.floor((totalTime % 3600) / 60)
    const timeStr = hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`

    this.setData({
      report: {
        date: dateStr,
        position: jdParsed.summary && jdParsed.summary.position || '面试练习',
        completionRate,
        completedQuestions,
        totalQuestions: questions.length,
        totalTime: timeStr,
        skills: jdParsed.skills || {},
        questions
      }
    })
  },

  // 展开/收起题目
  toggleQuestion(e) {
    const id = e.currentTarget.dataset.id
    const { expandedQuestions } = this.data
    
    this.setData({
      [`expandedQuestions.${id}`]: !expandedQuestions[id]
    })
  },

  // 分享报告
  shareReport() {
    const { report } = this.data
    
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    wx.showToast({
      title: '点击右上角分享',
      icon: 'none'
    })
  },

  // 开始新面试
  startNewInterview() {
    wx.switchTab({
      url: '/pages/jd-input/jd-input'
    })
  }
})

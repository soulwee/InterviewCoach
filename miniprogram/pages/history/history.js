// pages/history/history.js

Page({
  data: {
    history: [],
    filteredHistory: [],
    currentFilter: 'all',
    expandedId: null,
    stats: {
      totalInterviews: 0,
      totalQuestions: 0,
      totalTime: '0分钟'
    }
  },

  onLoad() {
    this.loadHistory()
  },

  onShow() {
    this.loadHistory()
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('interviewHistory') || []
    
    this.setData({
      history,
      filteredHistory: history
    })

    this.calculateStats()
    this.applyFilter()
  },

  // 计算统计数据
  calculateStats() {
    const { history } = this.data
    const totalInterviews = history.length
    const totalQuestions = history.reduce((sum, item) => {
      return sum + (item.questions && item.questions.filter(q => q.status === 'completed').length || 0)
    }, 0)
    const totalSeconds = history.reduce((sum, item) => sum + (item.totalTime || 0), 0)
    const totalTime = this.formatDuration(totalSeconds)

    this.setData({
      stats: { totalInterviews, totalQuestions, totalTime }
    })
  },

  // 格式化日期
  formatDate(dateStr) {
    if (!dateStr) return ''
    
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const oneDay = 24 * 60 * 60 * 1000

    // 今天
    if (diff < oneDay && date.getDate() === now.getDate()) {
      return '今天 ' + this.formatTime(date)
    }
    
    // 昨天
    if (diff < 2 * oneDay && date.getDate() === now.getDate() - 1) {
      return '昨天 ' + this.formatTime(date)
    }

    // 本周
    if (diff < 7 * oneDay) {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return weekdays[date.getDay()] + ' ' + this.formatTime(date)
    }

    // 其他
    return `${date.getMonth() + 1}/${date.getDate()} ${this.formatTime(date)}`
  },

  // 格式化时间
  formatTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  },

  // 格式化时长
  formatDuration(seconds) {
    if (!seconds) return '0分钟'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
  },

  // 切换筛选
  changeFilter(e) {
    const filter = e.currentTarget.dataset.filter
    this.setData({ currentFilter: filter })
    this.applyFilter()
  },

  // 应用筛选
  applyFilter() {
    const { history, currentFilter } = this.data
    const now = new Date()
    let filtered = []

    switch (currentFilter) {
      case 'today':
        filtered = history.filter(item => {
          const date = new Date(item.date)
          return date.toDateString() === now.toDateString()
        })
        break
      
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = history.filter(item => new Date(item.date) >= weekAgo)
        break
      
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        filtered = history.filter(item => new Date(item.date) >= monthAgo)
        break
      
      default:
        filtered = history
    }

    this.setData({ filteredHistory: filtered })
  },

  // 展开/收起
  toggleExpand(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      expandedId: this.data.expandedId === id ? null : id
    })
  },

  // 查看详情
  viewDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/result/result?id=${id}`
    })
  },

  // 再练一次
  rePractice(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.history.find(h => h.id === id)
    
    if (item) {
      wx.setStorageSync('currentJD', item.jdText)
      wx.navigateTo({
        url: '/pages/interview/interview?mode=repeat'
      })
    }
  },

  // 删除记录
  deleteItem(e) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条面试记录吗？',
      success: (res) => {
        if (res.confirm) {
          const history = this.data.history.filter(item => item.id !== id)
          wx.setStorageSync('interviewHistory', history)
          
          this.setData({ history })
          this.applyFilter()
          this.calculateStats()
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 开始面试
  startInterview() {
    wx.switchTab({
      url: '/pages/jd-input/jd-input'
    })
  }
})

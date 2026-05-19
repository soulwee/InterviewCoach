// pages/jd-input/jd-input.js

// JD模板数据
const JD_TEMPLATES = {
  frontend: `岗位职责：
1. 负责前端技术选型和架构设计
2. 主导前端项目开发，制定开发规范
3. 优化前端性能，提升用户体验
4. 解决技术难题，带队技术攻关

岗位要求：
1. 本科及以上学历，计算机相关专业
2. 5年以上前端开发经验
3. 精通React/Vue等主流框架，有大型项目实践经验
4. 熟悉TypeScript、ES6+高级特性
5. 了解前端工程化，熟悉Webpack/Vite配置
6. 有良好的架构设计能力和团队协作经验`,

  backend: `岗位职责：
1. 负责后端服务架构设计与开发
2. 设计和实现高并发、高可用的系统
3. 优化数据库性能和系统性能
4. 制定技术规范，指导初级工程师

岗位要求：
1. 本科及以上学历，计算机相关专业
2. 5年以上后端开发经验
3. 精通Java/Go/Python等主流后端语言
4. 熟悉微服务架构，有Spring Cloud项目经验
5. 精通MySQL/Redis/MongoDB等数据库
6. 熟悉Linux系统、Docker容器技术
7. 有高并发系统设计经验优先`,

  fullstack: `岗位职责：
1. 负责产品前后端功能开发
2. 设计数据库结构和API接口
3. 参与技术方案评审和架构设计
4. 解决项目中的技术难题

岗位要求：
1. 本科及以上学历，计算机相关专业
2. 3年以上全栈开发经验
3. 精通JavaScript/TypeScript，熟悉Node.js或Python
4. 熟悉前端框架React/Vue，有实际项目经验
5. 掌握MySQL/PostgreSQL等关系型数据库
6. 了解Redis缓存、消息队列等中间件
7. 有良好的代码风格和文档编写能力`,

  mobile: `岗位职责：
1. 负责移动端应用开发（iOS/Android/小程序）
2. 优化应用性能和用户体验
3. 参与技术方案设计和实现
4. 编写高质量、可维护的代码

岗位要求：
1. 本科及以上学历，计算机相关专业
2. 3年以上移动端开发经验
3. 熟悉React Native/Flutter/微信小程序开发
4. 精通iOS或Android原生开发
5. 熟悉移动端性能优化和适配
6. 有跨平台开发经验优先`
}

// 难度级别选项
const DIFFICULTY_LEVELS = [
  { label: '全部', value: 'all' },
  { label: '初级', value: 'easy' },
  { label: '中级', value: 'middle' },
  { label: '高级', value: 'high' }
]

Page({
  data: {
    jdText: '',
    selectedTemplate: '',
    questionCount: 10,
    difficultyLevels: DIFFICULTY_LEVELS,
    selectedDifficulty: 'all'
  },

  onLoad(options) {
    // 检查是否有传入的JD
    if (options.jd) {
      this.setData({ jdText: decodeURIComponent(options.jd) })
    }
  },

  // JD输入处理
  onJDInput(e) {
    this.setData({
      jdText: e.detail.value,
      selectedTemplate: '' // 手动输入时清除模板选择
    })
  },

  // 选择模板
  selectTemplate(e) {
    const type = e.currentTarget.dataset.type
    const template = JD_TEMPLATES[type]
    
    this.setData({
      jdText: template,
      selectedTemplate: type
    })
  },

  // 调整题目数量
  adjustQuestionCount(e) {
    const type = e.currentTarget.dataset.type
    let count = this.data.questionCount
    
    if (type === 'minus' && count > 5) {
      count -= 5
    } else if (type === 'plus' && count < 50) {
      count += 5
    }
    
    this.setData({ questionCount: count })
  },

  // 选择难度
  selectDifficulty(e) {
    this.setData({
      selectedDifficulty: e.currentTarget.dataset.value
    })
  },

  // 开始面试
  startInterview() {
    const { jdText, questionCount, selectedDifficulty } = this.data
    
    if (jdText.length < 50) {
      wx.showToast({
        title: '请输入更多JD内容',
        icon: 'none'
      })
      return
    }

    // 显示加载中
    wx.showLoading({
      title: '正在解析JD...',
      mask: true
    })

    // 模拟解析过程（实际项目中调用后端API）
    setTimeout(() => {
      // 保存当前JD到全局数据
      const app = getApp()
      app.globalData.currentJD = jdText
      app.globalData.interviewSettings = {
        questionCount,
        difficulty: selectedDifficulty
      }
      
      // 保存到本地存储
      wx.setStorageSync('currentJD', jdText)
      wx.setStorageSync('interviewSettings', { questionCount, difficulty: selectedDifficulty })
      
      wx.hideLoading()
      
      // 跳转到面试页面
      wx.navigateTo({
        url: '/pages/interview/interview'
      })
    }, 1500)
  }
})

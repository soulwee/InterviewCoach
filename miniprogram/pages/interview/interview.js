// pages/interview/interview.js

// 引入服务
const { generateQuestions, getAnswer } = require('../../services/question-generator.js')
const { parseJD, generateSkillTags } = require('../../services/jd-parser.js')

// 难度级别映射
const DIFFICULTY_MAP = {
  'easy': '初级',
  'middle': '中级',
  'high': '高级',
  'all': '全部'
}

// 提示内容库
const HINTS = {
  concept: '试着从以下几个角度思考：\n1. 定义和核心概念\n2. 工作原理\n3. 使用场景\n4. 优缺点',
  code: '思考步骤：\n1. 明确输入输出\n2. 选择合适的数据结构\n3. 设计算法\n4. 考虑边界情况',
  design: '设计思路：\n1. 明确需求和约束\n2. 顶层架构设计\n3. 核心组件设计\n4. 数据存储方案',
  system: '使用STAR法则：\nSituation - 背景\nTask - 任务\nAction - 行动\nResult - 结果'
}

Page({
  data: {
    // 面试数据
    questions: [],
    totalQuestions: 0,
    currentIndex: 0,
    currentQuestion: null,
    
    // 进度
    progressPercent: 0,
    elapsedTime: 0,
    
    // 回答
    userAnswer: '',
    codeAnswer: '',
    isSubmitting: false,
    
    // 状态
    isMarked: false,
    markedQuestions: [],
    
    // 弹窗
    showHintModal: false,
    showAnswerModal: false,
    showCompleteModal: false,
    hintContent: '',
    referenceAnswer: '',
    
    // 统计数据
    completedCount: 0,
    totalTime: 0,
    
    // JD信息
    jdText: '',
    jdParsed: null
  },

  timer: null,

  onLoad(options) {
    // 获取保存的JD
    const app = getApp()
    const jdText = wx.getStorageSync('currentJD') || app.globalData.currentJD || ''
    const settings = wx.getStorageSync('interviewSettings') || app.globalData.interviewSettings || {}

    if (!jdText) {
      wx.showToast({
        title: '请先输入JD',
        icon: 'none'
      })
      wx.navigateBack()
      return
    }

    // 生成面试题
    const result = generateQuestions(jdText, {
      count: settings.questionCount || 10,
      difficulty: settings.difficulty || 'all'
    })

    if (!result.success || result.questions.length === 0) {
      wx.showToast({
        title: '生成面试题失败',
        icon: 'none'
      })
      wx.navigateBack()
      return
    }

    // 解析JD
    const jdParsed = parseJD(jdText)

    this.setData({
      questions: result.questions,
      totalQuestions: result.questions.length,
      currentQuestion: result.questions[0],
      jdText,
      jdParsed,
      progressPercent: (1 / result.questions.length) * 100
    })

    // 加载已标记的题目
    const markedQuestions = wx.getStorageSync('markedQuestions') || []
    this.setData({ markedQuestions })

    // 开始计时
    this.startTimer()

    // 显示解析结果
    this.showParsingResult(jdParsed)
  },

  onUnload() {
    this.stopTimer()
  },

  // 显示解析结果
  showParsingResult(parsed) {
    if (parsed.success) {
      setTimeout(() => {
        wx.showToast({
          title: `识别到${parsed.summary.totalKeywords}个技能点`,
          icon: 'none',
          duration: 2000
        })
      }, 500)
    }
  },

  // 计时器
  startTimer() {
    this.timer = setInterval(() => {
      this.setData({
        elapsedTime: this.data.elapsedTime + 1
      })
    }, 1000)
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  // 格式化时间
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  // 获取难度文本
  getDifficultyText(difficulty) {
    return DIFFICULTY_MAP[difficulty] || '中级'
  },

  // 回答输入
  onAnswerInput(e) {
    this.setData({
      userAnswer: e.detail.value
    })
  },

  // 代码输入
  onCodeInput(e) {
    this.setData({
      codeAnswer: e.detail.value
    })
  },

  // 上一题
  prevQuestion() {
    const { currentIndex, questions } = this.data
    if (currentIndex > 0) {
      this.goToQuestion(currentIndex - 1)
    }
  },

  // 下一题
  nextQuestion() {
    const { currentIndex, questions } = this.data
    if (currentIndex < questions.length - 1) {
      this.goToQuestion(currentIndex + 1)
    }
  },

  // 跳转到指定题目
  goToQuestion(index) {
    const { questions, markedQuestions } = this.data
    const question = questions[index]
    
    this.setData({
      currentIndex: index,
      currentQuestion: question,
      userAnswer: question.userAnswer || '',
      codeAnswer: question.codeAnswer || '',
      isMarked: markedQuestions.includes(question.id),
      progressPercent: ((index + 1) / questions.length) * 100
    })
  },

  // 提交答案
  submitAnswer() {
    const { currentIndex, questions, userAnswer, codeAnswer, completedCount } = this.data
    const currentQuestion = questions[currentIndex]

    // 保存答案
    currentQuestion.userAnswer = userAnswer
    currentQuestion.codeAnswer = codeAnswer
    currentQuestion.answeredAt = new Date().toISOString()
    currentQuestion.status = 'completed'

    // 更新数据
    this.setData({
      questions,
      completedCount: completedCount + 1
    })

    // 保存到历史
    this.saveToHistory()

    // 判断是否最后一题
    if (currentIndex === questions.length - 1) {
      this.finishInterview()
    } else {
      this.goToQuestion(currentIndex + 1)
    }
  },

  // 是否最后一题
  get isLastQuestion() {
    return this.data.currentIndex === this.data.totalQuestions - 1
  },

  // 显示提示
  showHint() {
    const { currentQuestion } = this.data
    const hint = HINTS[currentQuestion.type] || HINTS.concept
    
    this.setData({
      showHintModal: true,
      hintContent: hint
    })
  },

  // 关闭提示弹窗
  closeHintModal() {
    this.setData({ showHintModal: false })
  },

  // 显示参考答案
  showAnswer() {
    const { currentQuestion, questions } = this.data
    const answerResult = getAnswer(currentQuestion.id, questions)

    if (answerResult.found) {
      this.setData({
        showAnswerModal: true,
        referenceAnswer: answerResult.answer
      })
    }
  },

  // 关闭答案弹窗
  closeAnswerModal() {
    this.setData({ showAnswerModal: false })
  },

  // 查看答案后下一题
  nextAfterViewAnswer() {
    this.closeAnswerModal()
    this.nextQuestion()
  },

  // 收藏题目
  markQuestion() {
    const { currentQuestion, markedQuestions } = this.data
    const questionId = currentQuestion.id
    
    let newMarked = [...markedQuestions]
    const index = newMarked.indexOf(questionId)
    
    if (index > -1) {
      newMarked.splice(index, 1)
    } else {
      newMarked.push(questionId)
    }

    this.setData({
      markedQuestions: newMarked,
      isMarked: !this.data.isMarked
    })

    wx.setStorageSync('markedQuestions', newMarked)

    wx.showToast({
      title: this.data.isMarked ? '已收藏' : '已取消收藏',
      icon: 'none'
    })
  },

  // 保存到历史记录
  saveToHistory() {
    const history = wx.getStorageSync('interviewHistory') || []
    const currentInterview = {
      id: Date.now(),
      date: new Date().toISOString(),
      jdText: this.data.jdText,
      jdSummary: this.data.jdParsed && this.data.jdParsed.summary ? this.data.jdParsed.summary : {},
      questions: this.data.questions,
      totalTime: this.data.elapsedTime,
      completedCount: this.data.completedCount
    }

    history.unshift(currentInterview)
    
    // 只保留最近50条记录
    if (history.length > 50) {
      history.pop()
    }

    wx.setStorageSync('interviewHistory', history)
  },

  // 完成面试
  finishInterview() {
    this.stopTimer()
    
    this.setData({
      showCompleteModal: true,
      totalTime: this.data.elapsedTime
    })

    // 保存最终记录
    this.saveToHistory()
  },

  // 再练一次
  reInterview() {
    this.setData({ showCompleteModal: false })
    wx.redirectTo({
      url: '/pages/interview/interview'
    })
  },

  // 查看报告
  viewResult() {
    this.setData({ showCompleteModal: false })
    wx.navigateTo({
      url: '/pages/result/result'
    })
  },

  // 阻止事件冒泡
  preventBubble() {}
})

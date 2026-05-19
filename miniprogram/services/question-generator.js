/**
 * 面试题生成服务模块
 * 功能：根据JD解析结果生成针对性的面试题
 * 依赖：config/index.js, jd-parser.js
 */

const config = require('../config/index.js')
const { parseJD, KEYWORD_WEIGHTS } = require('./jd-parser.js')

/**
 * 题库配置
 */
const QUESTION_BANK = config.QUESTION_BANK

/**
 * 生成面试题
 * @param {string} jdText - JD文本
 * @param {Object} settings - 生成设置
 * @returns {Object} 生成的面试题
 */
function generateQuestions(jdText, settings = {}) {
  const {
    count = 10,
    difficulty = 'all',
    includeSystemDesign = true,
    includeCode = true
  } = settings

  // 解析JD
  const parseResult = parseJD(jdText)
  
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error,
      questions: []
    }
  }

  const { keywords, skills, summary } = parseResult
  const questions = []

  // 1. 根据技术栈生成题目
  const techQuestions = generateTechQuestions(keywords, count, difficulty)
  questions.push(...techQuestions)

  // 2. 添加系统设计题目（根据职位级别）
  if (includeSystemDesign && summary.experience.required >= 3) {
    const designQuestions = generateSystemDesignQuestions(summary.topSkills)
    questions.push(...designQuestions)
  }

  // 3. 添加通用软技能题目
  const commonQuestions = generateCommonQuestions(2)
  questions.push(...commonQuestions)

  // 4. 如果需要手写代码题
  if (includeCode && questions.length < count) {
    const codeQuestions = generateCodeQuestions(keywords, count - questions.length)
    questions.push(...codeQuestions)
  }

  // 打乱顺序并截取指定数量
  const shuffled = shuffleArray(questions).slice(0, count)

  // 分配题号
  shuffled.forEach((q, index) => {
    q.id = index + 1
    q.jdKeywords = keywords.slice(0, 3).map(k => k.name)
  })

  return {
    success: true,
    meta: {
      totalKeywords: summary.totalKeywords,
      position: summary.position,
      experience: summary.experience,
      generatedAt: new Date().toISOString()
    },
    questions: shuffled
  }
}

/**
 * 根据技术栈生成面试题
 */
function generateTechQuestions(keywords, count, difficulty) {
  const questions = []
  const usedTypes = new Set()

  // 按权重排序关键词
  const sortedKeywords = [...keywords].sort((a, b) => b.weight - a.weight)

  for (const keyword of sortedKeywords) {
    if (questions.length >= count) break

    const name = keyword.name
    let category = findKeywordCategory(name)

    // 从题库中查找匹配的题目
    const bankQuestions = findQuestionsInBank(name, category)
    
    bankQuestions.forEach(q => {
      if (questions.length >= count) return
      if (usedTypes.has(q.question)) return

      // 检查难度匹配
      if (difficulty !== 'all' && q.difficulty !== difficulty && q.difficulty !== 'middle') {
        return
      }

      questions.push({
        ...q,
        source: name,
        category: category,
        status: 'pending'
      })
      usedTypes.add(q.question)
    })
  }

  // 如果题库不够，从通用题库补充
  if (questions.length < count) {
    const fallbackQuestions = getFallbackQuestions(count - questions.length, difficulty)
    questions.push(...fallbackQuestions)
  }

  return questions
}

/**
 * 查找关键词所属类别
 */
function findKeywordCategory(keyword) {
  if (QUESTION_BANK.languages[keyword]) return '语言'
  if (QUESTION_BANK.frameworks[keyword]) return '框架'
  if (QUESTION_BANK.databases[keyword]) return '数据库'
  if (['Git', 'Docker', 'Kubernetes'].includes(keyword)) return '工具'
  if (['数据结构', '算法', '系统设计'].includes(keyword)) return '基础'
  return '其他'
}

/**
 * 从题库查找题目
 */
function findQuestionsInBank(keyword, category) {
  const results = []

  // 在对应类别中查找
  if (QUESTION_BANK.languages[keyword]) {
    results.push(...QUESTION_BANK.languages[keyword])
  } else if (QUESTION_BANK.frameworks[keyword]) {
    results.push(...QUESTION_BANK.frameworks[keyword])
  } else if (QUESTION_BANK.databases[keyword]) {
    results.push(...QUESTION_BANK.databases[keyword])
  }

  return results
}

/**
 * 生成系统设计题目
 */
function generateSystemDesignQuestions(topSkills) {
  const questions = []
  const designQuestions = QUESTION_BANK.systemDesign

  // 根据技能选择相关系统设计题
  if (topSkills.includes('Redis') || topSkills.includes('MySQL')) {
    questions.push({
      ...designQuestions[0], // 短链接系统
      category: '系统设计',
      status: 'pending'
    })
  }

  if (topSkills.includes('Java') || topSkills.includes('Go')) {
    questions.push({
      ...designQuestions[1], // 秒杀系统
      category: '系统设计',
      status: 'pending'
    })
  }

  return questions
}

/**
 * 生成通用面试题
 */
function generateCommonQuestions(count) {
  const commonQuestions = QUESTION_BANK.common
  const shuffled = shuffleArray(commonQuestions)
  
  return shuffled.slice(0, count).map(q => ({
    ...q,
    category: '软技能',
    status: 'pending'
  }))
}

/**
 * 生成手写代码题
 */
function generateCodeQuestions(keywords, count) {
  const codeQuestions = []
  
  // 收集所有手写代码类型的题目
  const allCodeQuestions = []
  
  Object.values(QUESTION_BANK.languages).forEach(questions => {
    questions.filter(q => q.type === 'code').forEach(q => {
      allCodeQuestions.push({ ...q, category: '手写代码' })
    })
  })

  // 根据关键词选择相关语言
  const languageKeywords = keywords
    .filter(k => KEYWORD_WEIGHTS.languages[k.name])
    .map(k => k.name)

  // 优先选择匹配语言的题目
  languageKeywords.forEach(lang => {
    if (codeQuestions.length >= count) return
    
    const langQuestions = allCodeQuestions.filter(q => {
      const tags = q.tags || []
      return tags.some(tag => tag.includes(lang) || lang.includes(tag))
    })

    codeQuestions.push(...langQuestions.slice(0, 2))
  })

  return codeQuestions.slice(0, count)
}

/**
 * 获取备用题目
 */
function getFallbackQuestions(count, difficulty) {
  const fallback = [
    { type: 'concept', question: '解释一下什么是RESTful API？', difficulty: 'easy', tags: ['Web', 'API'], category: 'Web基础' },
    { type: 'concept', question: 'HTTP和HTTPS有什么区别？', difficulty: 'easy', tags: ['网络', '安全'], category: '网络' },
    { type: 'concept', question: '什么是Git分支管理策略？', difficulty: 'middle', tags: ['Git', '版本控制'], category: '工具' },
    { type: 'concept', question: '如何保证代码质量？有哪些实践方法？', difficulty: 'middle', tags: ['代码质量', '最佳实践'], category: '工程化' },
    { type: 'concept', question: '描述一下你参与过的最有挑战性的项目', difficulty: 'easy', tags: ['软技能', '项目经验'], category: '软技能' }
  ]

  const filtered = difficulty === 'all' 
    ? fallback 
    : fallback.filter(q => q.difficulty === difficulty || q.difficulty === 'middle')

  return shuffleArray(filtered).slice(0, count).map(q => ({
    ...q,
    status: 'pending'
  }))
}

/**
 * 打乱数组顺序
 */
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 获取题目参考答案
 */
function getAnswer(questionId, questions) {
  const question = questions.find(q => q.id === questionId)
  
  if (!question) {
    return { found: false }
  }

  // 生成或返回预设答案
  const answers = {
    'concept': `这是一道概念题。\n\n【解题思路】\n1. 首先理解问题的核心概念\n2. 梳理相关知识点\n3. 结合实际经验说明\n\n【参考答案】\n请根据具体问题给出详细解释...`,
    
    'code': `这是一道手写代码题。\n\n【解题思路】\n1. 分析题目要求\n2. 确定算法和数据结构\n3. 编写代码\n4. 测试边界情况\n\n【参考答案】\n\`\`\`javascript\n// 请在此处编写代码\nfunction solution() {\n  // your code here\n}\n\`\`\``,
    
    'design': `这是一道系统设计题。\n\n【解题思路】\n1. 明确需求和约束\n2. 设计高层架构\n3. 细化各组件设计\n4. 考虑扩展性和性能\n\n【参考答案】\n请从以下几个方面展开...`,
    
    'system': `这是一道行为面试题。\n\n【STAR法则】\n- Situation: 背景情况\n- Task: 具体任务\n- Action: 采取的行动\n- Result: 取得的结果\n\n【回答建议】\n请结合实际经历具体回答...`
  }

  return {
    found: true,
    question: question.question,
    type: question.type,
    answer: answers[question.type] || answers['concept']
  }
}

module.exports = {
  generateQuestions,
  getAnswer,
  findKeywordCategory,
  findQuestionsInBank
}

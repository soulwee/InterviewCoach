/**
 * JD解析服务模块
 * 功能：解析招聘要求，提取关键技能和岗位信息
 * 依赖：config/index.js
 */

/**
 * 关键词权重配置
 */
const KEYWORD_WEIGHTS = {
  // 编程语言
  languages: {
    JavaScript: 1.0, TypeScript: 1.2, Python: 1.0, Java: 1.0,
    Go: 1.1, 'C++': 1.0, C: 0.9, 'C#': 0.9, PHP: 0.8,
    Ruby: 0.8, Swift: 0.9, Kotlin: 0.9, Rust: 1.1
  },
  // 前端框架
  frameworks: {
    React: 1.2, Vue: 1.2, Angular: 1.0, 'React Native': 1.1,
    Flutter: 1.1, Node: 1.0, 'Node.js': 1.0, jQuery: 0.7,
    Bootstrap: 0.6, Tailwind: 0.8
  },
  // 后端框架
  backendFrameworks: {
    Spring: 1.1, 'Spring Boot': 1.2, 'Spring Cloud': 1.3,
    Django: 1.0, Flask: 0.9, FastAPI: 1.0,
    Express: 1.0, Koa: 0.9, NestJS: 1.0,
    Laravel: 0.9, Rails: 0.9
  },
  // 数据库
  databases: {
    MySQL: 1.0, PostgreSQL: 1.0, MongoDB: 1.0, Redis: 1.1,
    Elasticsearch: 1.0, Oracle: 0.9, SQLite: 0.7,
    'SQL Server': 0.8, Cassandra: 0.9, DynamoDB: 0.9
  },
  // 工具和中间件
  tools: {
    Git: 0.8, Docker: 1.1, Kubernetes: 1.2, Jenkins: 0.9,
    AWS: 1.1, Azure: 1.0, GCP: 0.9, Linux: 1.0,
    Nginx: 0.9, Kafka: 1.0, RabbitMQ: 0.9, GraphQL: 0.9
  },
  // 概念和技能
  concepts: {
    微服务: 1.0, 架构: 1.2, 设计模式: 1.0, 数据结构: 1.0,
    算法: 1.0, 'CI/CD': 1.0, 敏捷开发: 0.8, TDD: 0.9,
    单元测试: 0.8, 重构: 0.9, 性能优化: 1.1, 高并发: 1.2,
    分布式: 1.2, 缓存: 1.0, 消息队列: 1.0, 负载均衡: 1.0
  }
}

/**
 * 解析JD文本
 * @param {string} jdText - JD文本内容
 * @returns {Object} 解析结果
 */
function parseJD(jdText) {
  if (!jdText || typeof jdText !== 'string') {
    return {
      success: false,
      error: 'JD内容无效',
      keywords: [],
      skills: {},
      summary: {}
    }
  }

  // 转换为小写进行匹配
  const lowerText = jdText.toLowerCase()
  const keywords = []
  const skills = {}
  
  // 提取每类关键词
  Object.keys(KEYWORD_WEIGHTS).forEach(category => {
    const categoryKeywords = KEYWORD_WEIGHTS[category]
    const foundKeywords = []
    
    Object.keys(categoryKeywords).forEach(keyword => {
      // 精确匹配关键词
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = jdText.match(regex)
      
      if (matches && matches.length > 0) {
        foundKeywords.push({
          name: keyword,
          count: matches.length,
          weight: categoryKeywords[keyword]
        })
      }
    })
    
    if (foundKeywords.length > 0) {
      skills[category] = foundKeywords
      keywords.push(...foundKeywords)
    }
  })

  // 按权重排序关键词
  keywords.sort((a, b) => b.weight - a.weight)

  // 提取经验要求
  const experience = extractExperience(jdText)
  
  // 提取学历要求
  const education = extractEducation(jdText)
  
  // 提取职位名称
  const position = extractPosition(jdText)

  return {
    success: true,
    keywords: keywords.slice(0, 20), // 最多返回20个关键词
    skills,
    summary: {
      position: position,
      experience: experience,
      education: education,
      totalKeywords: keywords.length,
      topSkills: keywords.slice(0, 5).map(k => k.name)
    }
  }
}

/**
 * 提取经验要求
 * @param {string} text - JD文本
 * @returns {Object} 经验要求
 */
function extractExperience(text) {
  const patterns = [
    /(\d+)\+?\s*年以上?.*经验/gi,
    /经验要求[：:]\s*(\d+)\+?\s*年/gi,
    /(\d+)\+?\s*年.*开发.*经验/gi
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(text)
    if (match && match[1]) {
      return {
        required: parseInt(match[1]),
        description: match[0]
      }
    }
  }

  return { required: 0, description: '经验要求不明确' }
}

/**
 * 提取学历要求
 * @param {string} text - JD文本
 * @returns {Object} 学历要求
 */
function extractEducation(text) {
  const levels = [
    { name: '博士', pattern: /博士|PhD| doctorate/gi },
    { name: '硕士', pattern: /硕士|MBA|研究生|硕/gi },
    { name: '本科', pattern: /本科|学士|大学本科/gi },
    { name: '大专', pattern: /大专|专科|职高/gi }
  ]

  for (const level of levels) {
    if (level.pattern.test(text)) {
      return { required: level.name, description: `学历要求: ${level.name}` }
    }
  }

  return { required: '不限', description: '学历要求不明确' }
}

/**
 * 提取职位名称
 * @param {string} text - JD文本
 * @returns {string} 职位名称
 */
function extractPosition(text) {
  // 匹配职位名称模式
  const patterns = [
    /招聘[：:]?\s*([^\n，,。]+[开发工程师设计师架构师])/gi,
    /职位[：:]?\s*([^\n，,。]+)/gi,
    /岗位[：:]?\s*([^\n，,。]+)/gi
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(text)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return '未知职位'
}

/**
 * 根据关键词生成技能标签
 * @param {Array} keywords - 关键词数组
 * @returns {Array} 技能标签
 */
function generateSkillTags(keywords) {
  const tags = []
  const priorityMap = {
    'JavaScript': ['前端', '全栈'],
    'TypeScript': ['前端', '全栈'],
    'React': ['前端'],
    'Vue': ['前端'],
    'Node': ['后端', '全栈'],
    'Python': ['后端', 'AI', '全栈'],
    'Java': ['后端'],
    'Go': ['后端'],
    'MySQL': ['数据库'],
    'MongoDB': ['数据库', 'NoSQL'],
    'Redis': ['缓存', '数据库'],
    'Docker': ['DevOps'],
    'Kubernetes': ['DevOps', '架构']
  }

  keywords.forEach(k => {
    const name = k.name
    if (priorityMap[name]) {
      priorityMap[name].forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      })
    }
  })

  return tags
}

module.exports = {
  parseJD,
  extractExperience,
  extractEducation,
  extractPosition,
  generateSkillTags,
  KEYWORD_WEIGHTS
}

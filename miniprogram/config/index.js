/**
 * 全局配置文件
 */

// API配置
const API_BASE_URL = 'https://api.interviewcoach.com'
const CLOUD_ENV = 'your-cloud-env-id'

// 面试题库配置
const QUESTION_BANK = {
  // 编程语言
  languages: {
    JavaScript: [
      { type: 'concept', question: 'JavaScript的作用域链是什么？', difficulty: 'middle', tags: ['作用域', '闭包'] },
      { type: 'concept', question: '解释JavaScript中的原型链机制', difficulty: 'middle', tags: ['原型', '继承'] },
      { type: 'concept', question: 'JavaScript中的事件循环机制是什么？', difficulty: 'high', tags: ['异步', 'Event Loop'] },
      { type: 'code', question: '实现一个深拷贝函数', difficulty: 'middle', tags: ['手写代码'] },
      { type: 'code', question: '实现防抖(debounce)函数', difficulty: 'middle', tags: ['手写代码', '性能优化'] },
      { type: 'code', question: '实现节流(throttle)函数', difficulty: 'middle', tags: ['手写代码', '性能优化'] },
      { type: 'concept', question: 'var、let、const的区别是什么？', difficulty: 'easy', tags: ['ES6', '变量'] },
      { type: 'concept', question: 'Promise和async/await的区别和使用场景？', difficulty: 'middle', tags: ['异步', 'Promise'] },
      { type: 'concept', question: '解释JavaScript中的this指向问题', difficulty: 'middle', tags: ['this', '上下文'] }
    ],
    TypeScript: [
      { type: 'concept', question: 'TypeScript中的interface和type有什么区别？', difficulty: 'easy', tags: ['类型系统'] },
      { type: 'concept', question: 'TypeScript中的泛型是什么？有什么作用？', difficulty: 'middle', tags: ['泛型', '类型'] },
      { type: 'concept', question: 'TypeScript中的装饰器是什么？', difficulty: 'high', tags: ['装饰器', '元编程'] },
      { type: 'code', question: '实现一个通用的泛型函数，根据键名获取对象值', difficulty: 'middle', tags: ['手写代码', '泛型'] }
    ],
    Python: [
      { type: 'concept', question: 'Python中的生成器(Generator)和迭代器(Iterator)有什么区别？', difficulty: 'middle', tags: ['迭代器', '生成器'] },
      { type: 'concept', question: 'Python中的GIL是什么？对多线程有什么影响？', difficulty: 'high', tags: ['并发', 'GIL'] },
      { type: 'concept', question: 'Python中的装饰器是什么？有什么作用？', difficulty: 'middle', tags: ['装饰器', '元编程'] },
      { type: 'code', question: '实现一个LRU缓存装饰器', difficulty: 'high', tags: ['手写代码', '装饰器'] },
      { type: 'concept', question: 'Python中的多进程和多线程有什么区别？', difficulty: 'middle', tags: ['并发', '多线程'] }
    ],
    Java: [
      { type: 'concept', question: 'Java中的JVM内存模型是怎样的？', difficulty: 'high', tags: ['JVM', '内存'] },
      { type: 'concept', question: 'Java中的HashMap底层实现原理是什么？', difficulty: 'high', tags: ['集合框架', '数据结构'] },
      { type: 'concept', question: 'synchronized和ReentrantLock有什么区别？', difficulty: 'middle', tags: ['并发', '锁'] },
      { type: 'concept', question: 'Spring框架中的IoC和AOP是什么？', difficulty: 'middle', tags: ['Spring', '设计模式'] },
      { type: 'code', question: '实现一个线程安全的单例模式', difficulty: 'middle', tags: ['手写代码', '设计模式'] }
    ],
    Go: [
      { type: 'concept', question: 'Go语言中的协程(Goroutine)和线程有什么区别？', difficulty: 'middle', tags: ['并发', 'Goroutine'] },
      { type: 'concept', question: 'Go语言中的Channel是什么？有哪些类型？', difficulty: 'middle', tags: ['并发', 'Channel'] },
      { type: 'concept', question: 'Go语言中的defer关键字有什么作用？', difficulty: 'easy', tags: ['defer', '控制流'] },
      { type: 'code', question: '实现一个并发安全的计数器', difficulty: 'middle', tags: ['手写代码', '并发'] }
    ]
  },
  
  // 框架和库
  frameworks: {
    'React': [
      { type: 'concept', question: 'React中的虚拟DOM是什么？有什么优势？', difficulty: 'easy', tags: ['虚拟DOM', '核心概念'] },
      { type: 'concept', question: 'React中的Fiber架构是什么？', difficulty: 'high', tags: ['Fiber', '架构'] },
      { type: 'concept', question: 'React中的useEffect和useLayoutEffect有什么区别？', difficulty: 'middle', tags: ['Hooks'] },
      { type: 'concept', question: 'React中如何避免不必要的组件渲染？', difficulty: 'middle', tags: ['性能优化'] },
      { type: 'code', question: '实现一个自定义Hooks，用于获取窗口宽度', difficulty: 'easy', tags: ['Hooks', '手写代码'] }
    ],
    'Vue': [
      { type: 'concept', question: 'Vue中的响应式原理是什么？', difficulty: 'middle', tags: ['响应式', '核心概念'] },
      { type: 'concept', question: 'Vue中的nextTick是做什么的？', difficulty: 'middle', tags: ['异步', 'DOM更新'] },
      { type: 'concept', question: 'Vue3中的Composition API相比Options API有什么优势？', difficulty: 'middle', tags: ['Composition API'] },
      { type: 'concept', question: 'Vue中的keep-alive是做什么的？', difficulty: 'middle', tags: ['组件缓存'] }
    ],
    'Node.js': [
      { type: 'concept', question: 'Node.js中的事件循环机制是怎样的？', difficulty: 'high', tags: ['事件循环', '异步'] },
      { type: 'concept', question: 'Node.js中的Buffer是什么？', difficulty: 'middle', tags: ['Buffer', '二进制'] },
      { type: 'concept', question: 'Express和Koa中间件机制有什么区别？', difficulty: 'middle', tags: ['中间件'] },
      { type: 'concept', question: '如何优化Node.js应用的性能？', difficulty: 'high', tags: ['性能优化'] }
    ]
  },
  
  // 数据库
  databases: {
    'MySQL': [
      { type: 'concept', question: 'MySQL中的索引有哪些类型？各自的特点是什么？', difficulty: 'middle', tags: ['索引', '数据库设计'] },
      { type: 'concept', question: 'MySQL中的事务隔离级别有哪些？', difficulty: 'high', tags: ['事务', '隔离级别'] },
      { type: 'concept', question: '如何优化SQL查询性能？', difficulty: 'high', tags: ['SQL优化', '性能'] },
      { type: 'concept', question: 'MySQL中的锁机制是怎样的？', difficulty: 'high', tags: ['锁', '并发'] },
      { type: 'sql', question: '编写一个SQL查询，查找每个部门工资最高的前3名员工', difficulty: 'high', tags: ['SQL', '窗口函数'] }
    ],
    'MongoDB': [
      { type: 'concept', question: 'MongoDB中的文档结构有什么特点？', difficulty: 'easy', tags: ['文档数据库'] },
      { type: 'concept', question: 'MongoDB中的聚合管道是什么？', difficulty: 'middle', tags: ['聚合', '查询'] },
      { type: 'concept', question: 'MongoDB中的索引有哪些类型？', difficulty: 'middle', tags: ['索引'] }
    ],
    'Redis': [
      { type: 'concept', question: 'Redis支持哪些数据结构？', difficulty: 'easy', tags: ['数据结构'] },
      { type: 'concept', question: 'Redis中的持久化机制有哪些？RDB和AOF的区别是什么？', difficulty: 'high', tags: ['持久化'] },
      { type: 'concept', question: 'Redis中的缓存淘汰策略有哪些？', difficulty: 'middle', tags: ['缓存', '淘汰策略'] },
      { type: 'concept', question: 'Redis如何实现分布式锁？', difficulty: 'high', tags: ['分布式锁', '并发'] }
    ]
  },
  
  // 通用技能
  common: [
    { type: 'system', question: '自我介绍：介绍一下你自己以及你过去的工作经验', difficulty: 'easy', tags: ['软技能'] },
    { type: 'system', question: '你为什么想要离开现在的公司？', difficulty: 'easy', tags: ['软技能', '动机'] },
    { type: 'system', question: '你在项目中遇到的最大挑战是什么？如何解决的？', difficulty: 'middle', tags: ['软技能', '问题解决'] },
    { type: 'system', question: '你最近在学习什么新技术？有什么收获？', difficulty: 'middle', tags: ['软技能', '学习能力'] }
  ],
  
  // 系统设计
  systemDesign: [
    { type: 'design', question: '如何设计一个短链接系统（如Twitter的t.co）？', difficulty: 'high', tags: ['系统设计', 'URL缩短'] },
    { type: 'design', question: '如何设计一个秒杀系统？', difficulty: 'high', tags: ['系统设计', '高并发'] },
    { type: 'design', question: '如何设计一个实时聊天系统？', difficulty: 'high', tags: ['系统设计', '实时通信'] },
    { type: 'design', question: '如何设计一个分布式ID生成器？', difficulty: 'high', tags: ['系统设计', '分布式'] }
  ]
}

module.exports = {
  API_BASE_URL,
  CLOUD_ENV,
  QUESTION_BANK
}

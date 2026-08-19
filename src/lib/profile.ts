// 个人数据集中管理：以后只改这里，所有页面自动更新
export type Experience = {
  company: string;
  role: string;
  period: string;
  location?: string;
  bullets: string[];
  tags?: string[];
  highlight?: string; // 一句话 KPI
};

export type Project = {
  name: string;
  period: string;
  company: string;
  category: '硬件' | 'APP' | '快应用' | '后台系统' | '内容';
  summary: string;
  bullets: string[];
  metrics: string[];
  stack?: string[];
};

export type Skill = {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  group: '产品' | '设计' | '技术' | '数据';
};

export const me = {
  name: '瞿达炎',
  nameEn: 'Qu Dayan',
  role: '产品经理 / Product Manager',
  city: '深圳',
  phone: '19047061045', // 建议改成微信号或邮箱；这里先用真实数据
  email: 'qudayan@gmail.com',
  github: 'https://github.com/', // 待你提供真实链接
  // 求职方向
  target: {
    role: '产品经理',
    city: '深圳',
    salary: '18-20K',
  },
  // 一句话定位（hero 用）
  tagline: '用设计师的眼睛做产品，用工程师的脑子做决策。',
  // 长描述
  about: `从设计师转型的产品经理，过去 7 年在智能硬件、APP、快应用、ERP、广告投放系统等多个领域做过完整 0→1 和改版迭代。能独立输出高保真原型与交互规范，熟悉数据埋点、A/B 测试和广告变现链路；正在系统学习 AIGC，把 LLM、Stable Diffusion、Cursor 等工具接入日常工作流。`,
};

export const experiences: Experience[] = [
  {
    company: '深圳市嘉思拓科技有限公司',
    role: '产品经理',
    period: '2023.03 - 至今',
    location: '深圳',
    bullets: [
      '负责智能家居安全系统的竞品分析、需求调研与软硬件功能定义，推动产品持续迭代。',
      '负责酒店系统产品设计：竞品分析、小程序交互、智能主机/开关/门锁/窗帘等硬件功能设计。',
      '深度参与软硬件功能评审，跟进并解决产品相关问题，确保产品顺利上市。',
    ],
    tags: ['智能家居', 'IoT', '软硬件一体', '小程序'],
    highlight: '主导智能家居安全系统，集采销量 2000+',
  },
  {
    company: '深圳优优互联网络科技有限公司',
    role: '产品经理',
    period: '2019.06 - 2023.02',
    location: '深圳',
    bullets: [
      '快应用与移动端 APP 的 0→1 产品规划与设计，覆盖概念到实施全过程。',
      '负责 ERP 系统 0→1 规划搭建，深入调研市场趋势和竞品。',
      '与研发紧密配合，跟进产品研发进度，协调解决研发过程中的问题。',
    ],
    tags: ['APP', '快应用', 'ERP', '广告变现'],
    highlight: '工具/WiFi/清理类 APP 单产品线日活 5W',
  },
  {
    company: '深圳冷哥传媒有限公司',
    role: '产品经理',
    period: '2017.07 - 2019.04',
    location: '深圳',
    bullets: [
      '主导小说产品（狸猫阅读、星空阅读）和 PC 管理后台的产品改版规划与实施。',
      '跟踪用户反馈与竞品分析，持续优化产品体验。',
    ],
    tags: ['内容', 'PC 后台', '改版'],
    highlight: '小说阅读产品线日活 5W，日新增注册 3K',
  },
  {
    company: '深圳市一起乐乐网络科技有限公司',
    role: '产品经理',
    period: '2016.04 - 2017.06',
    location: '深圳',
    bullets: [
      '独立承担多个产品项目，从概念到 MVP 方案，输出完整产品规划。',
      '针对 80/90 后体育资讯爱好者，设计并实现讯体导报 APP 核心功能。',
    ],
    tags: ['APP', '内容', '0→1'],
    highlight: '讯体导报 APP 日活 8W+，日新增 1K+',
  },
];

export const projects: Project[] = [
  {
    name: '智能家居安全系统',
    period: '2023.03 - 至今',
    company: '深圳市嘉思拓科技有限公司',
    category: '硬件',
    summary: '集成智能门锁、监控摄像头与环境传感器的整套 IOT 安全方案。',
    bullets: [
      '主导市场调研、产品设计到上市全流程；与硬件工程师合作开发硬件原型。',
      '协调软硬件团队完成系统集成，使用项目管理工具定期组织项目复盘。',
      '向上汇报项目进度与风险，处理开发问题与项目资源调配。',
    ],
    metrics: ['行业奖项', '销售额同比 +20%', '集采销量 2000+'],
    stack: ['IoT', '小程序', '硬件原型', '项目管理'],
  },
  {
    name: '工具 / WiFi / 清理类 APP',
    period: '2022.10 - 2023.02',
    company: '深圳优优互联网络科技有限公司',
    category: 'APP',
    summary: '面向中老年用户的工具矩阵，通过马甲包形态满足差异化需求。',
    bullets: [
      '主导产品交互设计与需求制定，输出交互原型与 PRD。',
      '推进开发排期，协调前端资源，确保产品按时上线。',
    ],
    metrics: ['日活 5W', '日均活跃 4W+', '收益正向增长'],
    stack: ['交互原型', 'PRD', '数据分析'],
  },
  {
    name: '快应用',
    period: '2019.06 - 2022.11',
    company: '深圳优优互联网络科技有限公司',
    category: '快应用',
    summary: '快应用生态产品规划与设计，深耕广告变现链路。',
    bullets: [
      '需求评审、PRD 输出、开发排期、数据埋点与迭代优化闭环。',
      '探索锁屏、信息流广告与 DP 链路投放的精准化和个性化。',
    ],
    metrics: ['广告变现收益显著', '转化率提升'],
    stack: ['快应用', '信息流广告', 'DP 链路', '数据埋点'],
  },
  {
    name: 'ERP 系统',
    period: '2021.12 - 2022.06',
    company: '深圳优优互联网络科技有限公司',
    category: '后台系统',
    summary: '覆盖 CRM / SRM / OA / 财税 / 员工信息的企业业务管理系统。',
    bullets: [
      '参与公司业务管理系统的规划与调研分析。',
      '主导基础数据迁移方案设计（公司层面无先例），提出 UI 规范优化方案。',
    ],
    metrics: ['数据标准化方案落地', 'UI 规范获内部好评'],
    stack: ['CRM', 'SRM', 'OA', '数据迁移'],
  },
  {
    name: '投放管家',
    period: '2020.01 - 2021.02',
    company: '深圳优优互联网络科技有限公司',
    category: '后台系统',
    summary: '服务于广告事业部的素材下单与维护管理系统。',
    bullets: [
      '负责改版交互原型设计，深入调研需求背景。',
      '通过 Teambition 项目管理，按时甚至提前完成开发周期。',
    ],
    metrics: ['提前交付', '内部员工一致好评'],
    stack: ['原型设计', '项目管理'],
  },
  {
    name: '小说阅读类快应用',
    period: '2017.07 - 2019.04',
    company: '深圳冷哥传媒有限公司',
    category: '内容',
    summary: '狸猫阅读 & 星空阅读两款小说产品的改版与运营。',
    bullets: [
      '产品改版规划与实施；UI 与研发紧密协作。',
      '通过巨量引擎推广运营，持续增长付费转化率。',
    ],
    metrics: ['日活 5W', '日新增 3K', '付费转化提升'],
    stack: ['内容', '增长运营', '广告投放'],
  },
];

export const skills: Skill[] = [
  { name: '需求分析 / 竞品分析', level: 5, group: '产品' },
  { name: 'PRD / 交互原型 (Figma)', level: 5, group: '产品' },
  { name: '数据埋点 / A/B 测试', level: 4, group: '数据' },
  { name: 'RICE / KANO 优先级', level: 4, group: '产品' },
  { name: '广告变现 / 增长', level: 4, group: '产品' },
  { name: 'UI 设计 / 设计系统', level: 5, group: '设计' },
  { name: '品牌视觉 / 排版', level: 4, group: '设计' },
  { name: 'IoT / 软硬件协同', level: 4, group: '技术' },
  { name: 'SQL / Excel 高级', level: 3, group: '数据' },
  { name: 'Cursor / AIGC 工具链', level: 4, group: '技术' },
  { name: 'Notion / Teambition', level: 5, group: '产品' },
];

export const education = {
  school: '三门峡职业技术学院',
  major: '室内装饰设计',
  degree: '大专',
  period: '2013 - 2016',
  // 把"室内装饰设计"转成差异化优势
  highlight: '受过系统美学训练 — 相信产品的"灵魂"藏在视觉细节里。',
};

export const now = {
  learning: [
    { label: 'AIGC 在产品工作流中的应用（Prompt Engineering / Cursor / Devin）' },
    { label: '用 LLM 自动化 PRD 与用户调研报告' },
    { label: 'Stable Diffusion 出 UI 概念图工作流' },
  ],
};
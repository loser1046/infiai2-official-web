import { OFFICIAL_PROFILE_URLS } from './officialProfiles'

/** 非文案配置：官网公开下载从 Chat 版本管理接口读取。 */
export const SITE = {
  name: '灵谐',
  slogan: '你的分身，无限可能',
  siteUrl: 'https://lingxie.net',
  appUrl: 'https://app.lingxie.net',
  chatApiUrl: import.meta.env.VITE_OFFICIAL_CHAT_URL || 'https://chat.lingxie.net',
  downloadUrl: 'https://lingxie.net/#platforms',
  githubUrl: 'https://github.com/luyao-inc/infiai2-official-web',
  discordUrl: 'https://app.lingxie.net/',
  ecosystemUrl: 'https://github.com/openclaw',
  orgGithubUrl: 'https://github.com/luyao-inc',
  /** 全网官方账号主页（结构化数据 sameAs / llms.txt 同源） */
  officialSameAs: OFFICIAL_PROFILE_URLS,
} as const

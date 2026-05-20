import { OFFICIAL_PROFILE_URLS } from './officialProfiles'

/** 非文案配置：客户端安装包与 Release 托管在 infiai2-official-web 仓库 */
export const SITE = {
  name: '灵谐',
  slogan: '你的分身，无限可能',
  siteUrl: 'https://lingxie.net',
  appUrl: 'https://app.lingxie.net',
  /** 供 GitHub `releases/latest` API：`owner/repo` */
  githubRepo: 'luyao-inc/infiai2-official-web',
  downloadUrl: 'https://github.com/luyao-inc/infiai2-official-web/releases',
  githubUrl: 'https://github.com/luyao-inc/infiai2-official-web',
  discordUrl: 'https://app.lingxie.net/',
  ecosystemUrl: 'https://github.com/openclaw',
  orgGithubUrl: 'https://github.com/luyao-inc',
  /** 全网官方账号主页（结构化数据 sameAs / llms.txt 同源） */
  officialSameAs: OFFICIAL_PROFILE_URLS,
} as const

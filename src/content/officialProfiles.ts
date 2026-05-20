/**
 * 灵谐全网官方账号主页。
 *
 * 已从列表中剔除：
 * - Reddit：表格中与 Substack 重复，属错误行
 * - 优酷：`mp.youku.com/v2/login...` 为登录页，非稳定主页
 * - Pinterest：`https://www.pinterest.com/` 为站点首页，非品牌主页
 * - 空链接或非 http(s) 项（如「视频号」仅账号标识，见 public/llms.txt）
 */

export const OFFICIAL_PROFILE_URLS = [
] as const

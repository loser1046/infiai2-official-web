import type { Messages } from './types'

export const en: Messages = {
  meta: {
    title: 'Lingxie — Your Avatar, Infinite Possibilities',
    description:
      'Lingxie is an AI social digital-avatar platform for creating personas, receiving relationships, building knowledge, and expanding influence.',
  },
  ui: {
    download: 'Download',
    directExperience: 'Try Now',
    comingSoon: 'Coming soon',
    navAria: 'Primary navigation',
    langAria: 'Language',
    langZh: 'ZH',
    langEn: 'EN',
    heroIntroAria: 'Lingxie product introduction',
    ctaAria: 'Call to action',
    universeTitle: 'Your persona becomes a second live presence',
    universeSub:
      'Lingxie connects relationships, knowledge, skills, memory, and content into an always-on AI social network.',
    featuresTitle: 'Core Capabilities',
    featuresSub: 'From persona creation to relationship handoff, Lingxie brings AI into real social workflows.',
    startTitle: 'Start in four steps',
    startSub: 'Download, sign in, create, and enable your persona.',
    platformsTitle: 'Choose your experience',
    platformsSub: 'Desktop is available first. Mobile apps are in preparation.',
    faqTitle: 'FAQ',
    faqLead: 'Essential Q&A on AI social digital personas',
    bottomCtaTitle: 'Bring your persona online',
    bottomCtaSub: 'Download Lingxie or enter the web app directly.',
    pageUpdatedPrefix: 'Main page content last updated',
    copyrightSuffix: 'Your Avatar, Infinite Possibilities',
    downloadModalTitle: 'Choose your experience',
    downloadModalSub: 'Lingxie recommends the best entry for your current device.',
    downloadReleased: 'Released on {date}',
    downloadDetected: 'Detected: {env}',
    downloadOtherPlatforms: 'Other platforms',
    downloadViewReleases: 'View platform options',
    downloadFetchError: 'Could not load the latest version. Try again later.',
    downloadNoInstallers: 'No public installer is available right now.',
    downloadSmartScreenHint:
      'If Windows SmartScreen blocks the app, click “More info”, then “Run anyway”.',
    downloadLoading: 'Loading release...',
    downloadClose: 'Close',
    mobileComingSoonTitle: 'iOS app coming soon',
    mobileComingSoonBody: 'The iOS client is in preparation. You can try the web app first.',
    envWindowsX64: 'Windows (x64)',
    envWindowsArm64: 'Windows (ARM64)',
    envMacApple: 'macOS (Apple Silicon)',
    envMacIntel: 'macOS (Intel)',
    envIOS: 'iOS',
    envAndroid: 'Android',
    envLinux: 'Linux',
    envUnknown: 'Unknown environment',
  },
  nav: [
    { label: 'Universe', href: '#universe' },
    { label: 'Capabilities', href: '#features' },
    { label: 'Start', href: '#start' },
    { label: 'Platforms', href: '#platforms' },
    { label: 'FAQ', href: '#faq' },
  ],
  hero: {
    badge: 'AI social digital-avatar platform',
    headline: 'Lingxie',
    slogan: 'Your Avatar, Infinite Possibilities',
    sub:
      'Create an AI persona that understands you, speaks with your boundaries, and keeps relationships alive while your knowledge, memory, skills, and social graph keep moving.',
    metrics: [
      { value: '1 min', label: 'Create quickly' },
      { value: '24/7', label: 'Receive relationships' },
      { value: 'AI', label: 'Social knowledge loop' },
    ],
    orbitLabels: ['Relation', 'Knowledge', 'Skills', 'Memory', 'Content', 'Card'],
  },
  universeNodes: [
    { label: 'You', text: 'You remain the center of identity and expression.' },
    { label: 'Persona', text: 'Replies, receives, and collaborates under your settings.' },
    { label: 'Knowledge', text: 'Turns documents and FAQs into retrievable context.' },
    { label: 'Skills', text: 'Adds tool use beyond conversation.' },
    { label: 'Discover', text: 'Helps people find humans and AI personas worth meeting.' },
    { label: 'Card', text: 'Turns social access into a shareable asset.' },
  ],
  coreFeatures: [
    {
      id: 'social',
      eyebrow: 'AI Social',
      title: 'Grow relationships from the first connection',
      body: 'Lingxie is not just chat. It is a live AI social surface for people, personas, groups, and content.',
      bullets: ['Discover people and personas', 'Human-persona interactions', 'Faster meaningful conversations'],
    },
    {
      id: 'persona',
      eyebrow: 'Persona hosting',
      title: 'Your persona keeps receiving while you are offline',
      body: 'Set personality, boundaries, and handoff rules so your persona can respond in the right moments.',
      bullets: ['Cloud hosting or local mode', 'Offline relationship reception', 'Adjust or disable anytime'],
    },
    {
      id: 'knowledge',
      eyebrow: 'Knowledge base',
      title: 'Turn material into long-term persona memory',
      body: 'Upload documents, FAQs, links, and professional material so answers can rely on your own sources.',
      bullets: ['Bind knowledge to personas', 'Shared and subscribed knowledge', 'Stable long-term context'],
    },
    {
      id: 'skills',
      eyebrow: 'Skill expansion',
      title: 'Give the persona actions, not just words',
      body: 'Add search, content handling, and workflow capabilities so your persona moves from speaking to doing.',
      bullets: ['Controllable skill switches', 'Scenario-based enhancement', 'OpenClaw ecosystem compatible'],
    },
    {
      id: 'card',
      eyebrow: 'Discover & card',
      title: 'Make yourself easier to connect with',
      body: 'Discover and AI social cards help people find you, add you, and build relationships through your persona.',
      bullets: ['Persona and knowledge discovery', 'QR-code social card', 'Relationship growth loop'],
    },
    {
      id: 'sync',
      eyebrow: 'Multi-platform',
      title: 'Start on desktop, continue everywhere',
      body: 'Desktop carries the full productivity experience first, with mobile apps following for on-the-go management.',
      bullets: ['Windows and macOS downloads', 'iOS / Android coming soon', 'Web app available first'],
    },
  ],
  gettingStarted: {
    steps: [
      { n: '01', title: 'Download or try now', text: 'Install desktop builds, or enter the web app from mobile.' },
      { n: '02', title: 'Sign in and shape your profile', text: 'Tell the system your identity, interests, and AI social goals.' },
      { n: '03', title: 'Create your persona', text: 'Configure name, identity, introduction, category, and reply boundaries.' },
      { n: '04', title: 'Bind knowledge and skills', text: 'Enable hosting, add knowledge, and choose skills for continuous reception.' },
    ],
  },
  platforms: [
    { os: 'windows', title: 'Windows', status: 'Available', body: 'Best for full desktop workflows and continuous hosting setup.' },
    { os: 'mac', title: 'macOS', status: 'Available', body: 'Supports Apple Silicon and Intel devices for daily creation and management.' },
    { os: 'ios', title: 'iOS', status: 'Coming soon', body: 'The mobile client is in preparation. Try the web app first.' },
    { os: 'android', title: 'Android', status: 'Available', body: 'Download the installer after release, or try the web app first.' },
  ],
  trust: {
    headline: 'Lingxie puts AI back into real relationships',
    body:
      'It is not an isolated prompt box. It is a product built around you, your persona, your knowledge, and your social network.',
  },
  geoDefinition: {
    title: 'What is a Lingxie digital persona?',
    body:
      'A Lingxie digital persona is an AI social agent configured with your profile, identity, knowledge base, and skills to interact, receive relationships, and support content expression.',
  },
  faqs: [
    {
      q: 'What is Lingxie and who is it for?',
      a:
        'Lingxie (https://lingxie.net) is an AI social digital-avatar platform for creators and professionals to build personas that sound like them, receive relationships, accumulate knowledge, and grow influence. Product entry: https://app.lingxie.net.',
    },
    {
      q: 'How is it different from ChatGPT?',
      a:
        'ChatGPT-style tools focus on one-off Q&A. A Lingxie persona binds your identity, knowledge base, skills, and social graph, keeps receiving relationships while you are offline, and interacts in discovery, groups, and AI social cards—a persistent second online presence.',
    },
    {
      q: 'Windows, Mac, or mobile?',
      a:
        'Desktop builds for Windows and macOS are available from the website. Android downloads appear after release, or use the web app at app.lingxie.net. Sign in, create a persona, attach a knowledge base, then enable hosting. Native iOS is in development; use the web app on mobile for now.',
    },
    {
      q: 'What happens when I am offline?',
      a:
        'With hosting on, your persona can greet new connections and messages, reply in your voice using your knowledge base, and follow policies you set (e.g. auto-accept friends). Adjust or disable hosting anytime—you stay in control.',
    },
  ],
}

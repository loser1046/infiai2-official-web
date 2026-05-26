import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { DownloadModal } from './components/DownloadModal'
import { GEO_PAGE_CONTENT_DATE_ISO } from './content/geoPageDate.generated'
import { SITE } from './content/siteContent'
import { useLocale } from './i18n/LocaleProvider'
import type { PlatformItem } from './i18n/types'
import type { ClientOS } from './lib/clientPlatform'

const DOWNLOADABLE_PLATFORMS: ReadonlySet<PlatformItem['os']> = new Set(['windows', 'mac', 'android'])

const shell = 'h-screen overflow-hidden bg-[#03050b] text-slate-300 antialiased'
const container = 'mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8'

const primaryButton =
  'lx-cta inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-200/30 bg-[linear-gradient(110deg,#4f73ff,#23d5ff,#7c3cff)] px-6 text-sm font-bold text-white shadow-[0_0_34px_rgba(79,115,255,0.45)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_54px_rgba(35,213,255,0.5)] active:translate-y-0'
const ghostButton =
  'inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-bold text-white/90 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-cyan-300/[0.08] active:translate-y-0'
const sectionTitle = 'text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl'
const sectionSub = 'mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base'

function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale()
  const item = 'rounded-full px-3 py-1 text-xs font-bold transition'
  return (
    <div
      className="flex rounded-full border border-white/10 bg-white/[0.05] p-1 backdrop-blur"
      role="group"
      aria-label={t.ui.langAria}
    >
      <button
        type="button"
        className={`${item} ${locale === 'zh' ? 'bg-white text-[#06111f]' : 'text-slate-400 hover:text-white'}`}
        onClick={() => setLocale('zh')}
        aria-pressed={locale === 'zh'}
      >
        {t.ui.langZh}
      </button>
      <button
        type="button"
        className={`${item} ${locale === 'en' ? 'bg-white text-[#06111f]' : 'text-slate-400 hover:text-white'}`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        {t.ui.langEn}
      </button>
    </div>
  )
}

function Header() {
  const { t, homePath } = useLocale()
  return (
    <header className="relative z-50 h-[88px] border-b border-white/[0.08] bg-[#03050b]/82 backdrop-blur-2xl max-md:h-[72px]">
      <div className={`${container} flex h-full items-center justify-between gap-3`}>
        <a className="group flex items-center gap-3" href={homePath}>
          <img
            src="/logo.png"
            alt={`${t.hero.headline} logo`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-2xl object-contain ring-1 ring-white/15 transition group-hover:ring-cyan-300/50 max-md:h-9 max-md:w-9 max-md:rounded-xl"
          />
          <span className="text-lg font-black tracking-tight text-white max-md:text-base">{t.hero.headline}</span>
        </a>
        <nav
          aria-label={t.ui.navAria}
          className="flex justify-center gap-1 text-sm max-md:hidden"
        >
          {t.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 font-semibold text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  )
}

function HeroVisual({ labels }: { labels: string[] }) {
  const { t } = useLocale()
  const nodes = useMemo(
    () =>
      labels.map((label, index) => ({
        label,
        style: {
          '--i': index,
          '--angle': `${index * (360 / labels.length)}deg`,
          '--delay': `${index * -0.65}s`,
        } as CSSProperties,
      })),
    [labels],
  )

  return (
    <div className="lx-hero-visual" aria-hidden="true">
      <div className="lx-orbit lx-orbit-a" />
      <div className="lx-orbit lx-orbit-b" />
      <div className="lx-orbit lx-orbit-c" />
      <div className="lx-core">
        <img src="/logo.png" alt="" className="h-16 w-16 rounded-3xl object-contain" />
        <span>{t.hero.headline}</span>
      </div>
      {nodes.map((node) => (
        <div key={node.label} className="lx-orbit-node" style={node.style}>
          {node.label}
        </div>
      ))}
      <div className="lx-pulse lx-pulse-one" />
      <div className="lx-pulse lx-pulse-two" />
    </div>
  )
}

function HeroSection({ onDownloadClick }: { onDownloadClick: () => void }) {
  const { t } = useLocale()
  return (
    <section
      className="lx-story-section lx-story-hero relative"
      aria-label={t.ui.heroIntroAria}
    >
      <div className="lx-bg-grid" aria-hidden="true" />
      <div className={`${container} lx-hero-inner`}>
        <div className="lx-hero-grid">
          <div className="lx-hero-copy relative z-10">
            <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              {t.hero.badge}
            </span>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-white max-md:mt-5 max-md:text-4xl sm:text-6xl lg:mt-5 lg:text-6xl xl:text-7xl">
              {t.hero.headline}
            </h1>
            <p className="mt-4 text-2xl font-bold text-transparent bg-clip-text bg-[linear-gradient(100deg,#ffffff,#7dd3fc,#a78bfa)] max-md:text-[1.7rem] sm:text-3xl lg:text-[2rem] xl:text-3xl">
              {t.hero.slogan}
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-400 max-md:text-sm max-md:leading-7 lg:max-w-lg">
              {t.hero.sub}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 lg:mt-8 lg:justify-start">
              <button type="button" className={primaryButton} onClick={onDownloadClick}>
                {t.ui.download}
              </button>
              <a className={ghostButton} href={SITE.appUrl} target="_blank" rel="noreferrer">
                {t.ui.directExperience}
              </a>
            </div>
          </div>
          <div className="lx-hero-visual-wrap relative z-10">
            <HeroVisual labels={t.hero.orbitLabels} />
          </div>
        </div>
      </div>
    </section>
  )
}

function UniverseSection() {
  const { t } = useLocale()
  return (
    <section id="universe" className="lx-story-section lx-story-universe relative border-t border-white/[0.08]">
      <div className={`${container} grid min-h-full items-center gap-10 py-10 lg:grid-cols-[0.82fr_1.18fr]`}>
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Scene 01</p>
          <h2 className={sectionTitle}>{t.ui.universeTitle}</h2>
          <p className={sectionSub}>{t.ui.universeSub}</p>
        </div>
        <div className="lx-constellation" aria-hidden="true">
          {t.universeNodes.map((node, index) => (
            <div
              key={node.label}
              className="lx-constellation-node"
              style={{ '--delay': `${index * 70}ms`, '--i': index } as CSSProperties}
            >
              <span>{node.label}</span>
              <small>{node.text}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const { t } = useLocale()
  const primaryFeatures = t.coreFeatures.slice(0, 3)
  const secondaryFeatures = t.coreFeatures.slice(3)
  return (
    <section id="features" className="lx-story-section lx-story-features border-t border-white/[0.08]">
      <div className={`${container} grid min-h-full items-center gap-8 py-10 lg:grid-cols-[0.72fr_1.28fr]`}>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Scene 02</p>
          <div>
            <h2 className={sectionTitle}>{t.ui.featuresTitle}</h2>
            <p className={sectionSub}>{t.ui.featuresSub}</p>
          </div>
        </div>
        <div className="lx-feature-stage">
          {primaryFeatures.map((feature, index) => (
            <article
              key={feature.id}
              className="lx-feature"
              style={{ '--delay': `${index * 80}ms` } as CSSProperties}
            >
              <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{feature.eyebrow}</div>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">{feature.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">{feature.body}</p>
              <p className="mt-5 text-xs font-bold text-cyan-100/80">{feature.bullets[0]}</p>
            </article>
          ))}
          <div className="lx-feature-chips">
            {secondaryFeatures.map((feature) => (
              <span key={feature.id}>{feature.title}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StartSection() {
  const { t } = useLocale()
  return (
    <section id="start" className="lx-story-section lx-story-start border-t border-white/[0.08]">
      <div className={`${container} min-h-full py-10`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Scene 03</p>
          <h2 className={sectionTitle}>{t.ui.startTitle}</h2>
          <p className={`${sectionSub} mx-auto`}>{t.ui.startSub}</p>
        </div>
        <div className="lx-launch-rail">
          {t.gettingStarted.steps.map((step) => (
            <article key={step.n} className="lx-launch-step">
              <span className="text-xs font-black text-cyan-300">{step.n}</span>
              <h3 className="mt-5 text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PlatformsSection({ onDownloadClick }: { onDownloadClick: (preferredOs?: ClientOS) => void }) {
  const { t } = useLocale()
  return (
    <section id="platforms" className="lx-story-section lx-story-platforms border-t border-white/[0.08]">
      <div className={`${container} flex min-h-full items-center py-10`}>
        <div className="lx-platform-console">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Scene 04</p>
              <h2 className={sectionTitle}>{t.ui.platformsTitle}</h2>
              <p className={sectionSub}>{t.ui.platformsSub}</p>
            </div>
            <button type="button" className={primaryButton} onClick={() => onDownloadClick()}>
              {t.ui.download}
            </button>
          </div>
          <div className="lx-platform-grid">
            {t.platforms.map((platform) => {
              const downloadable = DOWNLOADABLE_PLATFORMS.has(platform.os)
              return (
                <article
                  key={platform.os}
                  className={`lx-platform-card ${downloadable ? 'cursor-pointer transition hover:border-cyan-300/25 hover:bg-white/[0.03]' : ''}`}
                  {...(downloadable
                    ? {
                        role: 'button',
                        tabIndex: 0,
                        onClick: () => onDownloadClick(platform.os),
                        onKeyDown: (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onDownloadClick(platform.os)
                          }
                        },
                      }
                    : {})}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-black text-white">{platform.title}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${platform.os === 'ios' ? 'bg-amber-300/15 text-amber-200' : 'bg-emerald-300/15 text-emerald-200'}`}
                    >
                      {platform.status}
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-500">{platform.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  const { t } = useLocale()
  return (
    <section className="lx-story-section flex items-center border-t border-white/[0.08] text-center">
      <div className={container}>
        <h2 className="mx-auto max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl">
          {t.trust.headline}
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
          {t.trust.body}
        </p>
      </div>
    </section>
  )
}

function FAQSection() {
  const { t } = useLocale()
  const [active, setActive] = useState(0)
  const visibleFaqs = t.faqs
  const activeFaq = visibleFaqs[active] ?? visibleFaqs[0]

  return (
    <section id="faq" className="lx-story-section lx-story-faq flex items-center border-t border-white/[0.08]">
      <div className={`${container} lx-faq-layout grid min-h-full items-center gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8`}>
        <div className="lx-faq-aside">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Scene 06</p>
          <h2 className={`${sectionTitle} lx-faq-title`}>{t.ui.faqTitle}</h2>
          <p className="lx-faq-lead">{t.ui.faqLead}</p>
          <div className="lx-faq-list">
            {visibleFaqs.map((item, index) => (
              <button
                key={item.q}
                type="button"
                className={`lx-faq-tab ${index === active ? 'is-active' : ''}`}
                onClick={() => setActive(index)}
              >
                <span>{item.q}</span>
                <strong>{String(index + 1).padStart(2, '0')}</strong>
              </button>
            ))}
          </div>
        </div>
        <article className="lx-faq-answer">
          <span>{String(active + 1).padStart(2, '0')}</span>
          <h3>{activeFaq.q}</h3>
          <p>{activeFaq.a}</p>
        </article>
      </div>
    </section>
  )
}

function FinalSection({ onDownloadClick }: { onDownloadClick: () => void }) {
  return (
    <section className="lx-story-section lx-story-final flex items-center border-t border-white/[0.08] py-8">
      <div className={`${container} lx-final-layout`}>
        <BottomCta onDownloadClick={onDownloadClick} />
        <SiteFooter />
      </div>
    </section>
  )
}

function BottomCta({ onDownloadClick }: { onDownloadClick: () => void }) {
  const { t } = useLocale()
  return (
    <div className="text-center" aria-label={t.ui.ctaAria}>
      <div className="rounded-[2.25rem] border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(79,115,255,0.2),rgba(35,213,255,0.08),rgba(124,60,255,0.16))] p-6 sm:p-8">
        <h2 className="text-3xl font-black tracking-tight text-white max-md:text-2xl sm:text-4xl">{t.ui.bottomCtaTitle}</h2>
        <p className="mt-5 text-slate-300">{t.ui.bottomCtaSub}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" className={primaryButton} onClick={onDownloadClick}>
            {t.ui.download}
          </button>
          <a className={ghostButton} href={SITE.appUrl} target="_blank" rel="noreferrer">
            {t.ui.directExperience}
          </a>
        </div>
      </div>
    </div>
  )
}

function SiteFooter() {
  const { t, homePath, locale } = useLocale()
  return (
    <footer className="lx-site-footer text-sm text-slate-600">
      <div className="lx-footer-left">
        <a className="text-base font-black text-slate-300 hover:text-white" href={homePath}>{t.hero.headline}</a>
        <div className="mt-3 space-y-1">
          <p>
            <span>{t.ui.pageUpdatedPrefix}</span>{' '}
            <time dateTime={GEO_PAGE_CONTENT_DATE_ISO}>{GEO_PAGE_CONTENT_DATE_ISO}</time>
          </p>
          <p>
            © {new Date().getFullYear()} {t.hero.headline} - {t.ui.copyrightSuffix}
          </p>
        </div>
      </div>
      <div className="lx-footer-right">
        <div className="flex flex-wrap justify-end gap-x-6 gap-y-2">
          <a className="hover:text-white" href={locale === 'en' ? '/en/terms/' : '/terms/'}>
            {t.ui.termsOfService}
          </a>
          <a className="hover:text-white" href={locale === 'en' ? '/en/privacy/' : '/privacy/'}>
            {t.ui.privacyPolicy}
          </a>
        </div>
        <a className="lx-icp hover:text-white" href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
          {locale === 'zh' ? '沪ICP备2025137719号-1' : 'ICP 2025137719-1'}
        </a>
      </div>
    </footer>
  )
}

function App() {
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [downloadPreferredOs, setDownloadPreferredOs] = useState<ClientOS | undefined>()
  const openDownload = (preferredOs?: ClientOS) => {
    setDownloadPreferredOs(preferredOs)
    setDownloadOpen(true)
  }
  const closeDownload = () => {
    setDownloadOpen(false)
    setDownloadPreferredOs(undefined)
  }
  const stageRef = useRef<HTMLElement | null>(null)
  const activeSceneRef = useRef(0)
  const wheelLockRef = useRef(false)
  const lockTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const getSections = () => Array.from(stage.querySelectorAll<HTMLElement>('.lx-story-section'))

    const goToScene = (index: number) => {
      const sections = getSections()
      const targetIndex = Math.max(0, Math.min(index, sections.length - 1))
      const target = sections[targetIndex]
      if (!target) return

      activeSceneRef.current = targetIndex
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      stage.scrollTo({ top: target.offsetTop, behavior: motion })
    }

    const syncSceneFromScroll = () => {
      const sections = getSections()
      if (sections.length === 0) return

      const firstSectionHeight = sections[0]?.offsetHeight || stage.clientHeight || 1
      const progress = stage.scrollTop / firstSectionHeight
      const nearestIndex = Math.max(0, Math.min(Math.round(progress), sections.length - 1))
      activeSceneRef.current = nearestIndex
    }

    const unlock = () => {
      wheelLockRef.current = false
      if (lockTimerRef.current) {
        window.clearTimeout(lockTimerRef.current)
        lockTimerRef.current = null
      }
    }

    const onWheel = (event: WheelEvent) => {
      if (downloadOpen || window.matchMedia('(max-width: 900px)').matches) return
      if (Math.abs(event.deltaY) < 18 || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return

      event.preventDefault()
      if (wheelLockRef.current) return

      wheelLockRef.current = true
      const direction = event.deltaY > 0 ? 1 : -1
      goToScene(activeSceneRef.current + direction)
      lockTimerRef.current = window.setTimeout(unlock, 820)
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    stage.addEventListener('scroll', syncSceneFromScroll, { passive: true })
    syncSceneFromScroll()

    return () => {
      stage.removeEventListener('wheel', onWheel)
      stage.removeEventListener('scroll', syncSceneFromScroll)
      if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current)
    }
  }, [downloadOpen])

  return (
    <div className={shell}>
      <Header />
      <main ref={stageRef} className="lx-scroll-stage">
        <HeroSection onDownloadClick={() => openDownload()} />
        <UniverseSection />
        <FeaturesSection />
        <StartSection />
        <PlatformsSection onDownloadClick={openDownload} />
        <TrustSection />
        <FAQSection />
        <FinalSection onDownloadClick={() => openDownload()} />
      </main>
      <DownloadModal open={downloadOpen} onClose={closeDownload} preferredOs={downloadPreferredOs} />
    </div>
  )
}

export default App

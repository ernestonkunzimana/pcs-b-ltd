module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sw', 'fr', 'rw', 'lg'],
    localeDetection: true,
  },
  fallbackLng: {
    'sw': ['en'],
    'fr': ['en'],
    'rw': ['en'],
    'lg': ['en'],
    'default': ['en']
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  ns: ['common', 'auth', 'dashboard', 'forms', 'navigation'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
}
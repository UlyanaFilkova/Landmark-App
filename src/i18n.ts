import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ru from './locales/ru.json'

const messages = {
  en,
  ru,
}

const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en',
  messages,

  pluralRules: {
    ru(count) {
      console.log(count)
      const mod10 = count % 10
      const mod100 = count % 100

      if (mod10 === 1 && mod100 !== 11) {
        return 0
      }
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
        return 1
      }
      return 2
    },
  },
})

export default i18n

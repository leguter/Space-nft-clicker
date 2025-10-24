import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Ваші переклади
// Для великих проектів, ці ресурси краще винести в окремі JSON файли
const resources = {
  en: {
    translation: {
      "welcomeMessage": "Welcome to React",
      "changeToUkrainian": "Change to Ukrainian",
      "changeToEnglish": "Change to English",
      "currentLanguage": "Current language is English"
    }
  },
  uk: {
    translation: {
      "welcomeMessage": "Ласкаво просимо до React",
      "changeToUkrainian": "Змінити на Українську",
      "changeToEnglish": "Змінити на Англійську",
      "currentLanguage": "Поточна мова: Українська"
    }
  }
};

i18n
  .use(initReactI18next) // підключаємо i18next до React
  .init({
    resources, // ваші переклади
    lng: "uk", // мова за замовчуванням
    fallbackLng: "en", // мова, яка буде використовуватися, якщо переклад відсутній

    interpolation: {
      escapeValue: false // React вже захищає від XSS
    }
  });

export default i18n;
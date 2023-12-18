import i18next from "i18next";
import { setLocale } from "yup";
import { fr } from "yup-locales";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
// Import your language translation files
import translation from "zod-i18n-map/locales/fr/zod.json";

// lng and resources key depend on your locale.
void i18next.init({
  lng: "fr",
  resources: {
    fr: { zod: translation },
  },
});

z.setErrorMap(zodI18nMap);

const setLanguage = () => setLocale(fr);

export default setLanguage;

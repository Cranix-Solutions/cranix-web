import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  language = 'de';
  translations = {};
  constructor(
    private translate: TranslateService,
    private storage: Storage,
  ) {
    this.setInitialAppLanguage();
  }

  setInitialAppLanguage() {
    this.language = this.translate.getBrowserLang();
    console.log('language is', this.language);
    this.translate.setDefaultLang(this.language);
    this.translations = this.translate.translations;
    console.log('trans is:', this.translate.translations);
    this.storage.get(LNG_KEY).then(val => {
      if (val) {
        this.setLanguage(val);
        this.language = val;
      }
    });
  }

  getLanguages() {
    return [
      { text: 'English', value: 'en' },
      { text: 'German', value: 'de' },
    ];
  }

  setLanguage(lng: string) {
    let lang = lng.toLowerCase();
    this.translate.use(lang);
    this.language = lang;
    this.storage.set(LNG_KEY, lang);
  }

  trans(val: string) {
    return this.translations[this.language][val] ? this.translations[this.language][val] : val;
  }

}

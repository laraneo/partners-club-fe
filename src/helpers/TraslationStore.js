// import { observable, action } from 'mobx'
// import flatten, { unflatten } from 'flat'
// import mobxRemotedev from 'mobx-remotedev'
// import lodashGet from 'lodash.get'
// import lodashCamelcase from 'lodash.camelcase'

// import { SecureStorage, Firebase, GoogleAnalytics, Message } from 'services'
// import BetconstructStore from 'stores/BetconstructStore'

// /** Mobx Translation Store to control all firebase translations */
// @mobxRemotedev({ onlyActions: true })
// class TranslationStore {
//   @observable selectedLanguage = 'en'
//   @observable languages = { en: { name: 'English', betConstructCode: 'eng' } }
//   @observable documents = {} // original documents from firebase
//   @observable collections = {} // parsed documents
//   @observable loadingCollections = {}

//   fallbackDoc = {}
//   SessionStore = null

//   /**
//    * Initialize some common needed firebase docs
//    */
//   init = async () => {
//     await Promise.all([
//       this.loadCollection('common'),
//       this.loadCollection('header'),
//       this.loadCollection('footer'),
//     ])
//   }

//   /**
//    * @description used to inject the session store here, avoid circular problem
//    */
//   injectSessionStore = async (SessionStore) => {
//     this.SessionStore = SessionStore
//     await this.loadLanguages()

//     Message.injectTranslationStore(this)
//     BetconstructStore.injectTranslationStore(this)
//   }

//   /**
//    * Simple helper function to return correct img url from firebase storage
//    * @method
//    * @param {string} url
//    * @param {boolean} onProduction to point the url to production firebase, cause we dont have all images on staging fb
//    */
//   getImageSrc = (url, onProduction) => {
//     let environment = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET

//     if (onProduction) {
//       environment = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_FALLBACK
//     }

//     return `https://firebasestorage.googleapis.com/v0/b/${environment}/o/${encodeURIComponent(
//       url
//     )}?alt=media`
//   }

//   /**
//    * Get if the selected lang is swedish
//    */
//   getIsSwedish = () => this.selectedLanguage === 'se'

//   /**
//    * @description get search language based on bet construct code
//    */
//   getSearchLanguage = () => {
//     const language = this.languages[this.selectedLanguage]

//     if (language && language.betConstructCode) {
//       return language.betConstructCode
//     }

//     return this.languages.en.betConstructCode
//   }

//   /**
//    * @description get machine (ip) language fallback to user selected language or english
//    */
//   getBetConstructLanguage = () => {
//     if (this.SessionStore.getIsSwedish()) {
//       return this.languages.se.betConstructCode
//     }

//     return this.getSearchLanguage()
//   }

//   /**
//    * @description return the value following the path
//    * @param path string
//    * @param defaultValue any
//    * @return any
//    */
//   path = (path, defaultValue) => lodashGet(this.collections, path, defaultValue)

//   /**
//    * @description get error messages trying to find using the backend message
//    * @param message string
//    */
//   getErrorByMessage = (message) => {
//     let parsedMessage = 'tryAgain'
//     if (typeof message === 'string') {
//       parsedMessage = lodashCamelcase(message)
//     }

//     return this.path(`common.errorMessages.${parsedMessage}`, message)
//   }

//   /**
//    * @description show the error notification when exception came and return the description
//    * @param exception object
//    */
//   getErrorByException = (exception) => {
//     let message

//     if (typeof exception === 'object') {
//       if (exception.response && exception.response.data) {
//         message = exception.response.data.message
//       } else if (exception.message) {
//         message = exception.message
//       }
//     } else if (typeof exception === 'string') {
//       message = exception
//     }

//     return this.getErrorByMessage(message)
//   }

//   /**
//    * @description helper to check if the document is loading, basically if not exists
//    * @return {boolean}
//    */
//   loading = (name) => {
//     if (typeof name === 'string') return !this.collections[name]

//     return name.some((key) => !this.collections[key])
//   }

//   /**
//    * @description get the t&c version based on firebase versions
//    * @return {number}
//    */
//   getTermsAndConditionsVersion = async () => {
//     await this.loadCollection('my_account')

//     return this.path('my_account.info_modal.terms_and_conditions').length - 1
//   }

//   /**
//    * Load a casino game by its id on firebase
//    */
//   loadCasinoGame = async (id) => {
//     const data = await Firebase.loadDocument('casinoGames', id)

//     return Object.keys(data).reduce((temp, key) => {
//       temp[key] = data[key]

//       if (typeof data[key][this.selectedLanguage] !== 'undefined') {
//         temp[key] = data[key][this.selectedLanguage]
//       } else if (typeof data[key].en !== 'undefined') {
//         temp[key] = data[key].en
//       }

//       return temp
//     }, {})
//   }

//   /**
//    * Load missing bet construct item from firebase, so we can show to the player
//    */
//   loadMissingBetConstructBet = (playerId) => {
//     return Firebase.loadDocument('missingBetconstructBets', `id_${playerId}`)
//   }

//   /**
//    * Load the settings document from firebase
//    */
//   loadSettings = async () => {
//     try {
//       const response = await Firebase.firestore
//         .collection('common')
//         .doc('settings')
//         .get()

//       return response.data()
//     } catch (error) {
//       return {}
//     }
//   }

//   /**
//    * @description load the languages from firebase
//    */
//   @action loadLanguages = async () => {
//     let response
//     try {
//       response = await Firebase.firestore
//         .collection('common')
//         .doc('langs')
//         .get()
//     } catch (error) {
//       GoogleAnalytics.sendFatal({
//         file: 'TranslationStore',
//         method: 'loadLanguages',
//         error,
//       })

//       return
//     }

//     this.languages = response.data()

//     this.setLanguageWithRules()
//   }

//   /**
//    * @description set the selected language by ip, by logged user country or by local storage
//    */
//   @action setLanguageWithRules = () => {
//     let language

//     if (this.SessionStore.getIsSwedish()) {
//       language = 'se'
//       SecureStorage.set('language', language)
//     } else {
//       const storageLanguage = SecureStorage.get('language')

//       if (storageLanguage) {
//         language = storageLanguage
//       } else if (
//         this.SessionStore.machine &&
//         this.SessionStore.machine.languages
//       ) {
//         language = this.SessionStore.getMachineLanguage()
//       }
//     }

//     language = language || this.selectedLanguage || 'en'

//     if (language !== this.selectedLanguage) {
//       this.selectedLanguage = language
//       this.parseCollection()
//     }
//   }

//   /**
//    * @param name string
//    * @description parse the doc selected to new language, fallback to english
//    */
//   @action parseDocument = (name) => {
//     if (this.documents[name]) {
//       let flatDocument = flatten(this.documents[name])

//       if (!this.fallbackDoc[name]) {
//         const languageCodes = Object.keys(this.languages)

//         this.fallbackDoc[name] = Object.keys(flatDocument).reduce(
//           (temp, key) => {
//             if (key.endsWith('.en')) {
//               temp[key] = flatDocument[key]
//             } else {
//               const splitKey = key.split('.')

//               if (!languageCodes.includes(splitKey.pop())) {
//                 temp[`${key}.en`] = flatDocument[key]
//               }
//             }

//             return temp
//           },
//           {}
//         )
//       }

//       let langDocument = {}

//       if (this.selectedLanguage !== 'en') {
//         langDocument = Object.keys(flatDocument).reduce((temp, key) => {
//           if (key.endsWith(`.${this.selectedLanguage}`)) {
//             temp[key] = flatDocument[key]
//           }

//           return temp
//         }, {})
//       }

//       flatDocument = { ...this.fallbackDoc[name], ...langDocument }

//       flatDocument = Object.keys(flatDocument).reduce((temp, key) => {
//         const parsedKey = key.slice(0, key.lastIndexOf('.'))

//         temp[parsedKey] = flatDocument[key]
//         return temp
//       }, {})

//       this.collections[name] = unflatten(flatDocument)
//     }
//   }

//   /**
//    * @description parse all collections to current selected language
//    */
//   parseCollection = () =>
//     Object.keys(this.documents).forEach(this.parseDocument)

//   /**
//    * @param language string
//    * @description change the selected language, fallback to english
//    */
//   @action changeLanguage = (language) => {
//     if (Array.isArray(language)) language = language[0] // To support mobile antd picker

//     if (language === this.selectedLanguage) return

//     this.selectedLanguage = language
//     this.parseCollection()

//     SecureStorage.set('language', language)

//     // TODO: bc need to be refactored, we need to redo all bc ws calls/subs after changing language, which is not possible now
//     // TODO: we should take a look, when we remove this line, on casino descriptions and dynamic loaded content on firebase in general
//     window.location.reload()
//   }

//   /**
//    * @description load docs from firebase, based on name
//    * @return promise/object of the document
//    */
//   @action getFirebaseDocuments = async (name) => {
//     let response
//     try {
//       this.loadingCollections[name] = Firebase.firestore
//         .collection('content')
//         .doc(name)
//         .get()

//       response = await this.loadingCollections[name]
//     } catch (error) {
//       GoogleAnalytics.sendFatal({
//         file: 'TranslationStore',
//         method: 'getFirebaseDocuments',
//         error,
//       })

//       return null
//     } finally {
//       delete this.loadingCollections[name]
//     }

//     this.documents[name] = response.data()
//     this.parseDocument(name)

//     return this.collections[name]
//   }

//   /**
//    * @param name the document name from firebase
//    * @description dispatch to load document and get promise, or just get current promise for name
//    * @return promise/object of the doc
//    */
//   loadCollection = (name) => {
//     if (this.loadingCollections[name]) return this.loadingCollections[name]
//     if (this.collections[name]) return this.collections[name]

//     return this.getFirebaseDocuments(name)
//   }
// }

// export default new TranslationStore()

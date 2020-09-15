import { ApiService } from 'services'

const isMobile = ApiService.checkIfIsMobile()

/** Abstraction layer to show all notifications messages, without worry about translation */
class Message {
  component = null
  TranslationStore = null

  /**
   * Inject the translation store to use it inside and avoid circular deps
   * @method
   * @param {object} component
   * @param {object} TranslationStore
   */
  injectTranslationStore = (TranslationStore) => {
    this.TranslationStore = TranslationStore
  }

  /**
   * Inject the current mobile or desktop component
   * @method
   * @param {object} component
   */
  injectComponent = (component) => {
    this.component = component

    if (isMobile) {
      // TODO: we should remove this when we create our own toast yo-ui comp
      window.addEventListener('click', () => component.hide(), true)
    }
  }

  /**
   * Show success notification
   * @method
   * @private
   * @param {string|object} options
   * @param {string} type
   */
  parseOptions = (options, type) => {
    if (isMobile) {
      let parsedContent

      if (typeof options === 'string') {
        parsedContent = this.TranslationStore.path(options, options)
      } else {
        parsedContent = this.TranslationStore.path(
          options.description,
          options.description
        )
      }

      return {
        ...options,
        duration: (options.duration || 3000) / 1000,
        content: parsedContent,
      }
    }

    let parsedOptions = options

    const message = `common.${type}`

    if (typeof options === 'string') {
      parsedOptions = { message, description: options }
    } else if (!options.message) {
      parsedOptions = { ...options, message }
    }

    parsedOptions = {
      ...parsedOptions,
      message: this.TranslationStore.path(
        parsedOptions.message,
        parsedOptions.message
      ),
      description: this.TranslationStore.path(
        parsedOptions.description,
        parsedOptions.description
      ),
    }

    return parsedOptions
  }

  /**
   * Show a toast notification: https://mobile.ant.design/components/toast/
   * @method
   * @private
   * @param {string} type - type of the message
   * @param {string|object?} options - object with options
   */
  show = (type, options = {}) => {
    const parsedOptions = this.parseOptions(options, type)

    if (isMobile) {
      if (type === 'error') {
        type = 'fail'
      } else if (type === 'warning') {
        type = 'info'
      }

      const { content, duration, onClose, mask = false } = parsedOptions

      this.component[type](content, duration, onClose, mask)
    } else {
      this.component[type](parsedOptions)
    }
  }

  /**
   * Show success notification
   * @method
   * @param {string|object} options
   */
  success = (options) => this.show('success', options)

  /**
   * Show fail notification
   * @method
   * @param {string|object} options
   */
  error = (options) => this.show('error', options)

  /**
   * Show info notification
   * @method
   * @param {string|object} options
   */
  info = (options) => this.show('info', options)

  /**
   * Show warning notification
   * @method
   * @param {string|object} options
   */
  warning = (options) => this.show('warning', options)

  /**
   * Show error notification by getErrorByException
   * @method
   * @param {object} exception - the exception object
   */
  exception = (exception) =>
    this.show('error', this.TranslationStore.getErrorByException(exception))

  /**
   * Simply destroys notifications
   * @method
   */
  destroy = () => {
    if (isMobile) {
      this.component.hide()
    } else {
      this.component.destroy()
    }
  }
}

export default new Message()

import Events from '../_events'
const NAME = 'ui.validate.field'

class ValidateField {
  #field
  #extraChecks = {}

  constructor(field) {
    this.#field = field

    // singleton per field
    if (this.#field.ValidateField) {
      return this.#field.ValidateField
    }

    this.#field.ValidateField = this

    // prevent browsers checks (will do it using JS)
    this.#field.setAttribute('novalidate', 'novalidate')

    this.#field.addEventListener('change', this.validate)
    this.#field.addEventListener('focusout', this.validate)

    this.#field.classList.add(`${NAME}--active`)
    this.#field.dispatchEvent(new Event(Events.FORM_INIT_VALIDATE_FIELD))
  }

  addExtraCheck = (validateFunc) => {
    this.#extraChecks[validateFunc.name] = validateFunc
    return this
  }

  validate = () => {
    // browser check
    if (!this.#field.checkValidity()) {
      console.warn(`${NAME}: ${this.#field.getAttribute('name')} validation failed`)

      return false
    }

    // run extra checks
    let valid = true
    for (const validateFuncName in this.#extraChecks) {
      valid = this.#extraChecks[validateFuncName](this.#field)

      if (!valid) {
        break
      }
    }

    return valid
  }

  destruct = () => {
    this.#field.removeAttribute('novalidate')
    this.#field.removeEventListener('change', this.validate)
    this.#field.removeEventListener('focusout', this.validate)

    delete this.#field.ValidateField

    this.#field.classList.remove(`${NAME}--active`)
  }
}

export default ValidateField

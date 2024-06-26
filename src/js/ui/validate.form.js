import Events from '../_events'
import ValidateField from './validate.field'

const NAME = 'ui.validate.form'

class ValidateForm {
  #steppedUI
  #form
  #extraChecks = {}

  constructor(form) {
    this.#form = form

    // singleton per form
    if (this.#form.ValidateForm) {
      return this.#form.ValidateForm
    }

    this.#form.ValidateForm = this

    console.log(`${NAME}: init`)
    // prevent browsers checks (will do it using JS)
    this.#form.setAttribute('novalidate', 'novalidate')

    // link extra UI API
    this.#form.addEventListener(`${Events.FORM_INIT_STEPPED}`, this.setStepFormUI)

    // init fields validation
    const fields = this.getFields()
    fields.forEach((field) => {
      new ValidateField(field)
    })

    this.#form.addEventListener('submit', this.submitHandler)

    this.#form.classList.add(`${NAME}--active`)
    this.#form.dispatchEvent(new Event(Events.FORM_INIT_VALIDATE))
  }

  getFields = () => {
    return this.#form.querySelectorAll('input,textarea,select')
  }

  submitHandler = async () => {
    console.log(`${NAME}: submitHandler`)
    const valid = await this.validate()

    if (!valid) {
      const alert = form.querySelector('.error,.alert-error')

      if (alert) {
        alert.scrollIntoView();
        this.#form.dispatchEvent(new Event(Events.FORM_VALIDATION_FAILED))

        // switch to step
        if (this.#steppedUI) {
          this.#steppedUI.step(alert.closest('.step'))
        }
      }
    }
  }

  addExtraCheck = (validateFunc) => {
    this.#extraChecks[validateFunc.name] = validateFunc
    return this
  }

  validate = async () => {
    let valid = true
    const fields = this.#form.querySelectorAll('input,textarea,select')

    // check fields
    for (const field of fields) {
      if (field.ValidateField) {
        valid = await field.ValidateField.validate()
        if (!valid) {
          break
        }
      }
    }

    if (!valid) {
      return false
    }

    // run extra checks
    for (const validateFuncName in this.#extraChecks) {
      valid = this.#extraChecks[validateFuncName](this.#form)

      if (!valid) {
        break
      }
    }

    return valid
  }

  setStepFormUI = () => {
    this.#steppedUI = this.#form.steppedForm
  }

  destruct = () => {
    console.log(`${NAME}: destruct`)

    this.#form.removeAttribute('novalidate')
    this.#form.removeEventListener(`${Events.FORM_INIT_STEPPED}`, this.setStepFormUI)

    // remove fields validation
    const fields = this.getFields()
    fields.forEach((field) => {
      if (field.ValidateField) {
        field.ValidateField.destruct()
      }
    })

    this.#form.removeEventListener('submit', this.submitHandler)

    delete this.#form.ValidateForm
    this.#form.classList.remove(`${NAME}--active`)
  }
}

export default ValidateForm

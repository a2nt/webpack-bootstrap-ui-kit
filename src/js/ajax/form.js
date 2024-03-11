
import Events from '@a2nt/ss-bootstrap-ui-webpack-boilerplate-react/src/js/_events'

const NAME = 'uiAjaxForm'
const CONTAINER_CLASS = 'form-container'

const submitForm = (e) => {
  const form = e.currentTarget

  e.preventDefault()

  console.log(`${NAME}: submit`)
  const data = new FormData(form);
  const parent = form.parentElement;
  const btns = form.querySelectorAll('input[type="submit"],button')
  const id = form.getAttribute('ID')

  btns.forEach((el) => {
    el.setAttribute('disabled', 'disabled')
  })
  data.append('formid', id)
  data.append('ajax', '1')


  clearAlerts(form)

  parent.classList.remove('loaded')
  parent.classList.add('loading')

  fetch(form.action, {
    method: form.method,
    headers: {
      'x-requested-with': 'XMLHttpRequest',
      'x-requested-form': id,
    },
    body: data,
  })
    .then(async (resp) => {
      if (!resp.ok) {
        console.error(`${NAME}: BAD RESPONSE`)
        console.log(resp)
        return
      }
      const body = resp.text().then((html) => {
        const result = processResponse(html)
        if (result.json) {
          return formProcessJson(form, result.data)
        }

        return replaceForm(form, result.data)
      })
    })
}

const clearAlerts = (form) => {
  form.querySelectorAll('.field__alert,.form__message').forEach((el) => {
    el.remove()
  })
}

const processResponse = (html) => {
  try {
    let json = JSON.parse(html)

    if (json.MainContent) {
      try {
        json = JSON.parse(json.MainContent)

        return {
          json: true,
          data: json,
        }

      } catch (e) {
        return {
          json: false,
          data: json.MainContent,
        }
      }
    }

    return {
      json: true,
      data: json,
    }
  } catch (e) {
    return {
      json: false,
      data: html,
    }
  }
}


const isAlertResponse = (msg) => {
  return msg.indexOf('class="alert') || msg.indexOf('class=\'alert')
}

const formProcessJson = (form, json) => {
  const status = json.status === 'good' || 'success' ? 'success' : 'danger'

  if (json.location) {
    console.log(`${NAME}: Redirect`)

    if (!json.loadAjax && typeof window.app.Router !== 'undefined') {
      const link = document.createElement('a')
      link.setAttribute('href', json.location)
      window.app.Router.linkClick(link, new Event('click'))
    } else {
      window.location = json.location
    }

    return setLoaded(form)
  }

  if (json.msgs) {
    const fieldset = form.querySelector('.form__fieldset')

    json.msgs.forEach((i) => {
      const msg = document.createElement('div')
      msg.classList.add(...['field__alert'])
      if (!isAlertResponse(i.message)) {
        msg.classList.add(...['alert', `alert-${status}`, `alert-${i.messageCast}`, `${i.messageType}`])
      }

      msg.innerHTML = i.message


      const field = form.querySelector(`[name="${i.fieldName}"],[name^="${i.fieldName}["]`)

      if (field) {
        field.classList.add('error')

        const fieldContainer = field.closest('.form__field')
        if (fieldContainer) {
          fieldContainer.classList.add('error')
          fieldContainer.appendChild(msg)
          return
        }
      }

      form.insertBefore(msg, fieldset)
    })

    return setLoaded(form)
  }

  const replacementHTML = !isAlertResponse(json.message)
    ? `<div class="alert alert-${status}">${json.message}</div>`
    : json.message

  return replaceForm(form, replacementHTML)
}

const setLoaded = (form) => {
  const parent = form.parentElement;

  parent.classList.remove('loading')
  parent.classList.add('loaded')

  const btns = form.querySelectorAll('input[type="submit"],button')
  btns.forEach((el) => {
    el.removeAttribute('disabled', 'disabled')
  })

  window.dispatchEvent(new Event(`${Events.AJAX}`))
}

const replaceForm = (form, html) => {
  const parent = form.parentElement;

  parent.innerHTML = html
  parent.classList.remove('loading')
  parent.classList.add('loaded')

  const newForm = parent.querySelector('form')
  if (newForm) {
    newForm.addEventListener('submit', submitForm)
    return setLoaded(newForm)
  }
}

const formInit = (form) => {
  if (form.dataset[`${NAME}Active`]) {
    console.log(`${NAME}: #${form.id} already activated`)
    return false
  }

  // wrap form
  const parent = form.parentElement;
  if (!parent.classList.contains(CONTAINER_CLASS)) {
    const elHtml = document.createElement('div')
    elHtml.classList.add(CONTAINER_CLASS)
    elHtml.append(form)
    parent.append(elHtml)
  }
  //

  form.dataset[`${NAME}Active`] = true

  form.addEventListener('submit', submitForm)
}

const init = () => {
  console.log(`${NAME}: init`)

  document.querySelectorAll('#MainContent form:not(.legacy),.ajax-form').forEach(formInit)
}

window.addEventListener(`${Events.LODEDANDREADY}`, init)
window.addEventListener(`${Events.AJAX}`, init)

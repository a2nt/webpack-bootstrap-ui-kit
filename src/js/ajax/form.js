
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


  form.querySelectorAll('.field__alert').forEach((el) => {
    el.remove()
  })

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

const processResponse = (html) => {
  try {
    let json = JSON.parse(html)

    if (json.MainContent) {
      try {
        json = JSON.parse(json.MainContent)

        return {
          json: true,
          data: json
        }

      } catch (e) {
        return {
          json: false,
          data: json.MainContent
        }
      }
    }

    return {
      json: true,
      data: json
    }
  } catch (e) {
    return {
      json: false,
      data: html
    }
  }
}

const formProcessJson = (form, json) => {
  const status = json.status === 'good' ? 'success' : 'danger'

  if (json.msgs) {
    json.msgs.forEach((i) => {
      const field = form.querySelector('[name="' + i.fieldName + '"],[name^="' + i.fieldName + '["]')
      if (field) {
        field.classList.add('error')

        const fieldContainer = field.closest('.form__field')
        if (fieldContainer) {
          fieldContainer.classList.add('error')

          const msg = document.createElement('div')
          msg.classList.add(...['field__alert', 'alert', `alert-${status}`, `alert-${i.messageCast}`, `${i.messageType}`])
          msg.innerHTML = i.message

          fieldContainer.appendChild(msg)
        }
      }
    })

    return setLoaded(form)
  }

  return replaceForm(form, `<div class="alert alert-${status}">${json.message}</div>`)
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

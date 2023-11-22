
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

  btns.forEach((el) => {
    el.setAttribute('disabled', 'disabled')
  })

  data.append('ajax', '1')
  form.parentElement.classList.add('loading')

  fetch(form.action, {
    method: form.method,
    headers: {
      'x-requested-with': 'XMLHttpRequest',
    },
    body: data,
  })
    .then(async (resp) => {
      const body = resp.text().then((html) => {
        try {
          const json = JSON.parse(html)
          console.log(`${NAME}: JSON response`)
          const status = json.status === 'good' ? 'success' : 'error'

          replaceForm(form, `<div class="alert alert-${status}">${json.message}</div>`)
        } catch (e) {
          console.log(`${NAME}: HTML response`)
          replaceForm(form, html)

          parent.querySelector('form').addEventListener('submit', submitForm)
        }
      })
    })
}

const replaceForm = (form, html) => {
  const parent = form.parentElement;

  parent.innerHTML = html
  parent.classList.remove('loading')
  parent.classList.add('loaded')

  window.dispatchEvent(new Event(`${Events.AJAX}`))
  return
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

  document.querySelectorAll('#MainContent form:not(.legacy)').forEach(formInit)
}

window.addEventListener(`${Events.LODEDANDREADY}`, init)
window.addEventListener(`${Events.AJAX}`, init)

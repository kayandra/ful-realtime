const main = () => {
  const counter = document.getElementById('counter')
  const trigger = document.getElementById('trigger')

  const source = new EventSource('/live')
  source.onmessage = (event) => (counter.textContent = event.data)

  trigger.addEventListener('click', async () => {
    const response = await fetch('/code', { method: 'POST' })
    const data = await response.json()

    trigger.textContent = 'Redirecting...'

    setTimeout(() => (window.location.href = `/play/${data.code}`), 1000)
  })
}

document.addEventListener('DOMContentLoaded', main)

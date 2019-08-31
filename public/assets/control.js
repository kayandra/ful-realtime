const main = function() {
  const wrapper = document.getElementById('wrapper')
  const code = document.getElementById('code')

  code.addEventListener('keydown', async function (event) {
    if (event.keyCode !== 13) {
      return
    }

    const id = event.target.value
    const response = await fetch(`code/${id}`)
    const data = await response.json()

    if (!data.found) {
      return alert('Not found, try again.')
    }

    const socket = new WebSocket(WS_ADDRESS)
    const parent = wrapper.parentNode

    // remove form
    parent.removeChild(wrapper)
    parent.textContent = 'Swipe and watch the ball move'

    // listen for socket events
    socket.addEventListener('open', function(event) {
      parent.addEventListener('mousemove', function (event) {
        socket.send(
          JSON.stringify({
            id,
            event: { x: event.clientX, y: event.clientY },
            type: 'MOVE',
          }),
        )
      })

      parent.addEventListener('touchmove', function (event) {
        socket.send(
          JSON.stringify({
            id,
            event: { x: event.touches[0].clientX, y: event.touches[0].clientY },
            type: 'MOVE',
          }),
        )
      })
    })
  })
}

document.addEventListener('DOMContentLoaded', main)

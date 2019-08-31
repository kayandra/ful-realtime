const main = () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  )
  camera.position.set(-3, 3, 4)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  const dirLight = new THREE.DirectionalLight()
  dirLight.position.set(1, 0.4, 0.2)
  scene.add(dirLight, new THREE.AmbientLight(0x444444))

  scene.add(new THREE.GridHelper(50, 100, 0x666666, 0x444444))

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  const ball = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  )
  scene.add(ball)

  camera.position.z = 5

  const socket = new WebSocket(WS_ADDRESS)

  socket.onopen = () => {
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.clear()
      renderer.render(scene, camera)
    }
    animate()
  }

  // listen for socket events
  socket.addEventListener('message', (event) => {
    const d = JSON.parse(event.data)
    if (d.type !== 'MOVE') return

    const { x, y } = d.event
    console.log(d.event)

    ball.position.x = x / 500
    ball.position.y = y / 500
  })
}

document.addEventListener('DOMContentLoaded', main)

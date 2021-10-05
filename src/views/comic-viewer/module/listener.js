export class Listener {
  keyCtrl = false

  constructor (resizeHandler, wheelHandler, keyDownHandler, keyUpHandler) {
    this.resizeHandler = resizeHandler
    this.wheelHandler = wheelHandler
    this.keyDownHandler = keyDownHandler
    this.keyUpHandler = keyUpHandler
  }

  register () {
    const context = this
    window.addEventListener('resize', (event) => {
      context.handleResize(event)
    })
    window.addEventListener('mousewheel', (event) => {
      context.handleWheel(event)
    })
    window.addEventListener('keydown', (event) => {
      context.handleKeyDown(event)
    })
    window.addEventListener('keyup', (event) => {
      context.handleKeyUp(event)
    })
  }

  handleResize (event) {
    this.resizeHandler(event)
  }

  handleWheel (event) {
    this.wheelHandler(event, this.keyCtrl)
  }

  handleKeyDown (event) {
    console.debug('[listener]keydown:' + event.code)
    switch (event.code) {
      case 'ControlLeft':
        this.keyCtrl = true
        break
      default:
        this.keyDownHandler(event.code)
        break
    }
  }

  handleKeyUp (event) {
    console.debug('[listener]keyup:' + event.code)
    switch (event.code) {
      case 'ControlLeft':
        this.keyCtrl = false
        break
      default:
        this.keyUpHandler(event.code)
        break
    }
  }

  getKeyCtrl () {
    return this.keyCtrl
  }
}

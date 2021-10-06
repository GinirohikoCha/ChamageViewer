export class Listener {
  static context = null

  static keyCtrl = false

  constructor (resizeHandler, wheelHandler, keyDownHandler, keyUpHandler) {
    if (Listener.context == null) {
      Listener.context = this
    } else {
      return Listener.context
    }
    this.resizeHandler = resizeHandler
    this.wheelHandler = wheelHandler
    this.keyDownHandler = keyDownHandler
    this.keyUpHandler = keyUpHandler
  }

  register () {
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('mousewheel', this.handleWheel)
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  unRegister () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('mousewheel', this.handleWheel)
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  handleResize (event) {
    Listener.context.resizeHandler(event)
  }

  handleWheel (event) {
    Listener.context.wheelHandler(event, Listener.keyCtrl)
  }

  handleKeyDown (event) {
    console.debug('[listener]keydown:' + event.code)
    switch (event.code) {
      case 'ControlLeft':
        Listener.keyCtrl = true
        break
      default:
        Listener.context.keyDownHandler(event.code)
        break
    }
  }

  handleKeyUp (event) {
    console.debug('[listener]keyup:' + event.code)
    switch (event.code) {
      case 'ControlLeft':
        Listener.keyCtrl = false
        break
      default:
        Listener.context.keyUpHandler(event.code)
        break
    }
  }

  getKeyCtrl () {
    return Listener.keyCtrl
  }
}

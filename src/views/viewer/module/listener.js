export class Listener {
  static context = null

  static mouseX = 0
  static mouseY = 0
  static hover = false
  static dragging = false
  static keyCtrl = false

  constructor (resizeHandler, wheelHandler, mouseDownHandler, mouseUpHandler, mouseMoveHandler,
    keyDownHandler, keyUpHandler) {
    if (Listener.context == null) {
      Listener.context = this
    } else {
      return Listener.context
    }
    this.resizeHandler = resizeHandler
    this.wheelHandler = wheelHandler
    this.mouseDownHandler = mouseDownHandler
    this.mouseUpHandler = mouseUpHandler
    this.mouseMoveHandler = mouseMoveHandler
    this.keyDownHandler = keyDownHandler
    this.keyUpHandler = keyUpHandler
  }

  register () {
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('mousewheel', this.handleWheel)
    window.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  unRegister () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('mousewheel', this.handleWheel)
    window.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  handleResize (event) {
    Listener.context.resizeHandler(event)
  }

  handleWheel (event) {
    Listener.context.wheelHandler(event, {
      hover: Listener.hover,
      mouseX: Listener.mouseX,
      mouseY: Listener.mouseY
    })
  }

  handleMouseDown (event) {
    switch (event.button) {
      case 0:
        console.debug('[listener]mousedown:left ' + event.clientX + ', ' + event.clientY)
        Listener.mouseX = event.clientX
        Listener.mouseY = event.clientY
        if (Listener.hover) {
          Listener.context.setDragging(true)
        }
        break
      case 1:
        console.debug('[listener]mousedown:middle')
        Listener.context.mouseDownHandler(event)
        break
    }
  }

  handleMouseUp (event) {
    console.debug('[listener]mouseup')
    Listener.context.setDragging(false)
  }

  handleMouseMove (event) {
    if (Listener.dragging || Listener.hover) {
      if (Listener.dragging) {
        Listener.context.mouseMoveHandler(event.clientX - Listener.mouseX, event.clientY - Listener.mouseY)
      }
      Listener.mouseX = event.clientX
      Listener.mouseY = event.clientY
    }
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

  setDragging (bool) {
    Listener.dragging = bool
    console.debug('[listener]dragging:' + Listener.dragging)
  }

  setHover (bool) {
    Listener.hover = bool
    console.debug('[listener]hover:' + Listener.hover)
  }

  getKeyCtrl () {
    return Listener.keyCtrl
  }
}

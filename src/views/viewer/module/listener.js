export class Listener {
  mouseX = 0
  mouseY = 0
  hover = false
  dragging = false
  keyCtrl = false

  constructor (resizeHandler, wheelHandler, mouseDownHandler, mouseUpHandler, mouseMoveHandler,
    keyDownHandler, keyUpHandler) {
    this.resizeHandler = resizeHandler
    this.wheelHandler = wheelHandler
    this.mouseDownHandler = mouseDownHandler
    this.mouseUpHandler = mouseUpHandler
    this.mouseMoveHandler = mouseMoveHandler
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
    window.addEventListener('mousedown', (event) => {
      context.handleMouseDown(event)
    })
    window.addEventListener('mouseup', (event) => {
      context.handleMouseUp(event)
    })
    window.addEventListener('mousemove', (event) => {
      context.handleMouseMove(event)
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
    this.wheelHandler(event, {
      hover: this.hover,
      mouseX: this.mouseX,
      mouseY: this.mouseY
    })
  }

  handleMouseDown (event) {
    switch (event.button) {
      case 0:
        console.debug('[listener]mousedown:left')
        this.mouseX = event.clientX
        this.mouseY = event.clientY
        if (this.hover) {
          this.setDragging(true)
        }
        break
    }
  }

  handleMouseUp (event) {
    console.debug('[listener]mouseup')
    this.setDragging(false)
  }

  handleMouseMove (event) {
    if (this.dragging || this.hover) {
      if (this.dragging) {
        this.mouseMoveHandler(event.clientX - this.mouseX, event.clientY - this.mouseY)
      }
      this.mouseX = event.clientX
      this.mouseY = event.clientY
    }
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

  setDragging (bool) {
    this.dragging = bool
    console.debug('[listener]dragging:' + this.dragging)
  }

  setHover (bool) {
    this.hover = bool
    console.debug('[listener]hover:' + this.hover)
  }

  getKeyCtrl () {
    return this.keyCtrl
  }
}

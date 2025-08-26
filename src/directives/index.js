import MouseDragDirective from './mouseDrag'
import mouseDoubleDirective from './mouseDouble'
export default {
  install (app) {
    app.directive('mouse-drag', MouseDragDirective)
    app.directive('mouse-db', mouseDoubleDirective)
  }
}

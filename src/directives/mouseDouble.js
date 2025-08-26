const MouseDragDirective = {
  mounted (el, binding) {
    const handler = binding.value
    let flag = false
    el.addEventListener('dblclick', function (e) {
      flag = !flag
      handler(flag)
    })
  }
}
export default MouseDragDirective

var vueFingerConstructor = function(el, options){
	this.el = el
	// add touch event
	this.el.addEventListener("touchstart", this.start.bind(this), false)
	this.el.addEventListener("touchmove", this.move.bind(this), false)
	this.el.addEventListener("touchend", this.end.bind(this), false)
	this.el.addEventListener("touchcancel",this.cancel.bind(this),false)

	// init 
	this.x1 = this.x2 = this.y1 = this.y2 = null;
	this.swipe = options.swipe
}

vueFingerConstructor.prototype = {
	start:function(e) {
		if(!e.touches) return
		this.x1 = e.touches[0].pageX
  	this.y1 = e.touches[0].pageY
	},
	move:function(e) {
		var currentX = e.touches[0].pageX,
    currentY = e.touches[0].pageY
		this.x2 = currentX;
    this.y2 = currentY;
	},
	end:function(e) {
		if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
    (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
    	e.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
      this.swipe(e)
    }
	},
	cancel:function() {

	},
	detach:function() {
		// add touch event
		this.el.removeEventListener("touchstart", this.start.bind(this), false)
		this.el.removeEventListener("touchmove", this.move.bind(this), false)
		this.el.removeEventListener("touchend", this.end.bind(this), false)
		this.el.removeEventListener("touchcancel",this.cancel.bind(this),false)
	},
	_swipeDirection: function (x1, x2, y1, y2) {
  	return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }
}


var vueFinger = {}

vueFinger.install = function (Vue, options) {

  Vue.directive('finger', {
    bind (el, binding, vnode, oldVnode) {
    	console.log(binding)
    	if (binding.arg === "swipe") {
				new vueFingerConstructor(el, {swipe:binding.value})
    	}
    }
  })

}

module.exports = vueFinger
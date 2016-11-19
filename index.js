var vueFingerConstructor = function(el, options) {
    this.el = el
        // add touch event
    this.el.addEventListener("touchstart", this.start.bind(this), false)
    this.el.addEventListener("touchmove", this.move.bind(this), false)
    this.el.addEventListener("touchend", this.end.bind(this), false)
    this.el.addEventListener("touchcancel", this.cancel.bind(this), false)

    // init 
    this.x1 = this.x2 = this.y1 = this.y2 = null;
    this.swipe = options.swipe
    this.swipeMove = options.swipeMove
}

vueFingerConstructor.prototype = {
    start: function(e) {
        if (!e.touches) return
        this.x1 = e.touches[0].pageX
        this.y1 = e.touches[0].pageY
        this.previous = {
            x1: this.x1,
            y1: this.y1
        }
        e.distanceX = 0 
        e.distanceY = 0
    },
    move: function(e) {
        var currentX = e.touches[0].pageX,
            currentY = e.touches[0].pageY
        this.x2 = currentX
        this.y2 = currentY
		
        e.distanceX = this.x2 - this.x1  
        e.distanceY = this.y2 - this.y1

        e.deltaX = currentX - this.previous.x1
        e.deltaY = currentY - this.previous.y1
        
        this.previous = {
            x1: currentX,
            y1: currentY
        }

        if ((currentX && Math.abs(e.distanceX) > 30) ||
            (currentY && Math.abs(e.distanceY) > 30)) {
        	e.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
        	if (this.swipeMove) this.swipeMove(e)
        }
    },
    end: function(e) {
        if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
            (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
            e.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
            e.distanceX = this.x2 - this.x1  
            e.distanceY = this.y2 - this.y1
            if (this.swipe) this.swipe(e)
        }
    },
    cancel: function() {

    },
    detach: function() {
        // add touch event
        this.el.removeEventListener("touchstart", this.start.bind(this), false)
        this.el.removeEventListener("touchmove", this.move.bind(this), false)
        this.el.removeEventListener("touchend", this.end.bind(this), false)
        this.el.removeEventListener("touchcancel", this.cancel.bind(this), false)
    },
    _swipeDirection: function(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }
}


var vueFinger = {}
vueFinger.swipeArr = []
vueFinger.swipeMoveArr = []

vueFinger.install = function(Vue, options) {

    Vue.directive('finger', {
        bind: function(el, binding, vnode, oldVnode) {
            console.log(binding)
            if (binding.arg === "swipe") {
                var ins = new vueFingerConstructor(el, {
                    swipe: binding.value
                })
                vueFinger.swipeArr.push(ins)
            }
            if (binding.arg === "swipeMove") {
                var ins = new vueFingerConstructor(el, {
                    swipeMove: binding.value
                })
                vueFinger.swipeMoveArr.push(ins)
            }
        },
        unbind: function() {
            vueFinger.swipeArr.forEach(function(item) {
                item.detach()
                item = null
            })
            vueFinger.swipeMoveArr.forEach(function(item) {
                item.detach()
                item = null
            })
        }
    })

}

module.exports = vueFinger

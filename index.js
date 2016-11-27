var vueFingerConstructor = function(el, options) {
    this.el = el
    // add touch event
    this.startCallback = this.start.bind(this)
    this.moveCallback = this.move.bind(this)
    this.endCallback = this.end.bind(this)
    this.cancelCallback = this.cancel.bind(this)
    this.el.addEventListener("touchstart", this.startCallback, false)
    this.el.addEventListener("touchmove", this.moveCallback, false)
    this.el.addEventListener("touchend", this.endCallback, false)
    this.el.addEventListener("touchcancel", this.cancelCallback, false)

    // init 
    this.x1 = this.x2 = this.y1 = this.y2 = null;
    this.swipe = options.swipe
    this.swipeMove = options.swipeMove
    this.pintch = options.pintch
    this.pintchDistance = 50
}

vueFingerConstructor.prototype = {
    start: function(e) {
        e.preventDefault()
        if (!e.touches) return
        this.x1 = e.touches[0].pageX
        this.y1 = e.touches[0].pageY
        if(e.touches.length > 1){
            this.p1 = e.touches[1].pageX
            this.q1 = e.touches[1].pageY
            this.pintchDistance1 = Math.sqrt(Math.pow((this.x1-this.p1),2) + Math.pow((this.y1-this.q1),2))
        }
        

        this.previous = {
            x1: this.x1,
            y1: this.y1
        }
        e.distanceX = 0 
        e.distanceY = 0
        
    },
    move: function(e) {
        e.preventDefault()
        var currentX = e.touches[0].pageX,
            currentY = e.touches[0].pageY;
            if(e.touches.length > 1){
                currentP = e.touches[1].pageX,
                currentQ = e.touches[1].pageY,
                this.p2 = currentP,
                this.q2 = currentQ
            }

        this.x2 = currentX
        this.y2 = currentY
        this.p2 = currentP
        this.q2 = currentQ
		
        e.distanceX = this.x2 - this.x1  
        e.distanceY = this.y2 - this.y1
        if(e.touches.length > 1){
            this.pintchDistance2 = Math.sqrt(Math.pow((this.x2 - this.p2),2) + Math.pow((this.y2 - this.q2),2))
            if(this.pintchDistance2 > this.pintchDistance1){
                e.customscale = 1 + (this.pintchDistance2 - this.pintchDistance1)/this.pintchDistance
            }else{
                if(e.customscale - (this.pintchDistance1 - this.pintchDistance2)/this.pintchDistance < 1){
                    e.customscale = 10.0
                }else{
                    e.customscale -= (this.pintchDistance1 - this.pintchDistance2)/this.pintchDistance
                }
            }
            if (this.pintch) {
                this.pintch(e)
            }
        }
        

        e.deltaX = currentX - this.previous.x1
        e.deltaY = currentY - this.previous.y1
        
        this.previous = {
            x1: currentX,
            y1: currentY,
            p1: currentP,
            q1: currentQ
        }

        if ((currentX && Math.abs(e.distanceX) > 30) ||
            (currentY && Math.abs(e.distanceY) > 30)) {
        	e.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
        	if (this.swipeMove) this.swipeMove(e)
        }
    },
    end: function(e) {
        e.preventDefault()
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
        // remove touch event
        this.el.removeEventListener("touchstart", this.startCallback, false)
        this.el.removeEventListener("touchmove", this.moveCallback, false)
        this.el.removeEventListener("touchend", this.endCallback, false)
        this.el.removeEventListener("touchcancel", this.cancelCallback, false)
    },
    _swipeDirection: function(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }
}


var vueFinger = {}
vueFinger.swipeArr = []
vueFinger.swipeMoveArr = []
vueFinger.pintchArr = []

vueFinger.install = function(Vue, options) {

    Vue.directive('finger', {
        bind: function(el, binding, vnode, oldVnode) {
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
            if (binding.arg === "pintch") {
                var ins = new vueFingerConstructor(el, {
                    pintch: binding.value
                })
                vueFinger.pintchArr.push(ins)
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
            vueFinger.pintchArr.forEach(function(item) {
                item.detach()
                item = null
            })
        }
    })

}

module.exports = vueFinger

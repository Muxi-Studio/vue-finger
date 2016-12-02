var util = require("./src/util.js")

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
    this.x1 = this.x2 = this.y1 = this.y2 = null
    this.swipe = options.swipe
    this.swipeMove = options.swipeMove
    this.pintch = options.pintch
    this.tap = options.tap
    this.doubleTap = options.doubleTap
    this.pintchDistance = 400
    this.tapTimeout
    this.mutiTouchWating = true
    this.swipeMoveTimeout
    this.doubleTapTimeout
    // scale
}

vueFingerConstructor.prototype = {
    start: function(e) {
        var self = this
        console.log("start")
        // reset
        this.x1 = this.x2 = this.y1 = this.y2 = null

        e.preventDefault()
        if (!e.touches) return
        this.x1 = e.touches[0].pageX
        this.y1 = e.touches[0].pageY
        if(e.touches.length > 1){
            this.mutiTouchWating = false
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

        // set tap timout
        if (this.tap) {
            if (e.target !== this.el) {
                this.tapTimeout = 
                setTimeout(this.tap.bind({}, e, Array.prototype.slice.call(this.el.childNodes).indexOf(e.target)),200)
            }else {
                this.tapTimeout = setTimeout(function(){
                    if (!self.doubleTapTimeout) {
                        this.tap.bind({}, e)
                    }
                },200)
            }
        }  

        this.mutiTouchWating = true
        setTimeout(function(){
            self.mutiTouchWating = false
        },40)

        if (this.doubleTap && (e.touches.length == 1)) {
            if (this.doubleTapTimeout){
                this.doubleTap()
                this.doubleTapTimeout = null
            }else{
                this.doubleTapTimeout = setTimeout(function(){
                    this.doubleTapTimeout = null
                },100)
            }
        }
    },
    move: function(e) {
        e.preventDefault()
        if (this.tapTimeout) {
            clearTimeout(this.tapTimeout)
            this.tapTimeout = null
        }
        if (this.doubleTapTimeout) {
            clearTimeout(this.doubleTapTimeout)
            this.doubleTapTimeout = null
        }
       
        var currentX = e.touches[0].pageX,
            currentY = e.touches[0].pageY;

        if(e.touches.length > 1){
            var currentP = e.touches[1].pageX,
                currentQ = e.touches[1].pageY;
            this.p2 = currentP
            this.q2 = currentQ
        }

        this.x2 = currentX
        this.y2 = currentY

        e.distanceX = this.x2 - this.x1  
        e.distanceY = this.y2 - this.y1
        if(e.touches.length > 1){
            this.pintchDistance2 = Math.sqrt(Math.pow((this.x2 - this.p2),2) + Math.pow((this.y2 - this.q2),2))
            //alert(this.pintchDistance2,this.pintchDistance1)
            e.customscale =  (this.pintchDistance2 - this.pintchDistance1)/this.pintchDistance
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
        	if (this.swipeMove && (e.touches.length == 1) && !this.mutiTouchWating) this.swipeMove(e)
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

var instancesHash = {}
var vueFinger = {}

vueFinger.install = function(Vue, options) {

    Vue.directive('finger', {
        bind: function(el, binding, vnode, oldVnode) {
            if (!el.dataset.vfingerId) {
                el.dataset.vfingerId = util.hashGen()
                var options = {}  
                options[binding.arg] = binding.value
                var ins = new vueFingerConstructor(el, options)
                instancesHash[el.dataset.vfingerId] = ins
            }else {
                instancesHash[el.dataset.vfingerId][binding.arg] = binding.value
            }
        },
        unbind: function(el) {
            var ins = instancesHash[el.dataset.vfingerId]
            ins.detach()
            ins = null
        }
    })

}

module.exports = vueFinger

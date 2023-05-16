import { Bullet } from "./bullet.js"

export class Player {
    constructor(x, y, color, bulletArray) { 
        this.color = color

        this.base = new Path.Circle({
            center : [x, y],
            radius : 25,
            strokeColor : this.color,
            fillColor : this.color
        })

        this.lives = 3
        this.velocity = 0
        this.bulletVelocity = 5
        this.mousePoint = new Point(this.base.position.x, this.base.position.y)
        this.lookPath = new Path.Line(this.base.position, this.base.position)
        this.bulletArray = bulletArray
        
        this.text = new PointText({
            point: new Point(this.base.position.x, this.base.position.y),
            content: this.lives,
            fillColor: "white"
        })
    }
    
    accelerate(v) {
        this.velocity += v
        if (this.velocity > 5) {
            this.velocity = 5
        } else if (this.velocity < -5) {
            this.velocity = -5
        }
    }   

    decelerate(v) {
        if (this.velocity > 0) {
            this.velocity += v
        } else if (this.velocity < 0) {
            this.velocity -= v
        }
    }

    move() {
        this.dir = new Point({
            length: this.velocity/2,
            angle: this.calculateAngle(this.mousePoint),   
        })
        
        this.base.position.x += this.dir.x
        this.base.position.y += this.dir.y
    }

    update() {
        this.healthText()
        this.move()
        this.lookDir()
    }

    shoot() {
        let turret_pos = this.base.position.add(new Point({angle: this.calculateAngle(this.mousePoint), length: 35}))
        this.bulletArray.push(new Bullet(turret_pos.x, turret_pos.y, 3, this.calculateAngle(this.mousePoint), this.color))
    }

    death() {
        this.base.remove()
        this.text.remove()
    }

    calculateAngle(point) {
        let playerPos = new Point(this.base.position.x, this.base.position.y)
        let mousePos = new Point(point.x, point.y)
        let lookVector = mousePos.subtract(playerPos)

        if (lookVector.length < 5) {
            this.velocity = 0
        }

        return lookVector.angle
    }

    healthText() {
        this.text.content = this.lives
        this.text.position.x = this.base.position.x
        this.text.position.y = this.base.position.y
    }

    rotate(point) {
        this.mousePoint = point
    }

    lookDir() {
        this.lookPath.remove()
        this.lookPath = new Path.Line(this.base.position, this.base.position.add(new Point({ angle: this.calculateAngle(this.mousePoint), length: 35 })))
        this.lookPath.sendToBack()
        this.lookPath.strokeColor = this.color
        this.lookPath.strokeWidth = 17.5
    }
}

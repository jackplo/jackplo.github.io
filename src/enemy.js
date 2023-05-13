import { Bullet } from "./bullet.js"

export class Enemy {
    constructor(x, y, color, player, bulletArray) {
        this.color = color
        this.player = player
        
        this.base = Path.Circle({
            center: [x, y],
            radius: 25,
            strokeColor: this.color,
            fillColor: this.color
        })

        this.velocity = 0
        this.bulletVelocity = 5
        this.bulletArray = bulletArray
        this.lives = 3
        this.interval = 0
        this.lookPath = new Path.Line(this.base.position, this.base.position)
    }

    accelerate(v) {
        this.velocity += v
        if (this.velocity > 2) {
            this.velocity = 2
        } else if (this.velocity < -2) {
            this.velocity = -2
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
        let dir = new Point({
            length: 3/2,
            angle: this.calculateAngle(this.player),   
        })
    
        this.base.position.x += dir.x
        this.base.position.y += dir.y
    }

    stop() {
        this.velocity = 0
        let dir = new Point({
            length: 0,
            angle: this.calculateAngle(this.player)
        })

        this.base.position.x += dir.x
        this.base.position.y += dir.y
    }

    death() {
        this.base.remove()
        this.lookPath.remove()
        clearInterval(this.interval)
    }

    shoot() {
        this.interval = setInterval(() => {
            let turret_pos = this.base.position.add(new Point({angle: this.calculateAngle(this.player), length: 35}))
            this.bulletArray.push(new Bullet(turret_pos.x, turret_pos.y, 3, this.calculateAngle(this.player), this.color))
        }, 2000)
    }

    calculateAngle(player) {
        let enemyPos = new Point(this.base.position.x, this.base.position.y)
        this.playerPos = new Point(player.base.position.x, player.base.position.y)
        let lookVector = this.playerPos.subtract(enemyPos)

        if (lookVector.length < 10) {
            this.velocity = 0
        }

        return lookVector.angle
    }

    pythagorean(playerPos, enemyPos) {
        let vectorDistance = playerPos.subtract(enemyPos)
        let distance = Math.sqrt(vectorDistance.x**2 + vectorDistance.y**2)

        return distance
    }

    update() {
        let playerPos = new Point(this.player.base.position)
        let enemyPos = new Point(this.base.position)
        this.lookPath.remove()
        this.lookPath = new Path.Line(this.base.position, this.base.position.add(new Point({angle: this.calculateAngle(this.player), length: 35})))
        this.lookPath.strokeColor = this.color
        this.lookPath.strokeWidth = 17.5

        this.pythagorean(playerPos, enemyPos) > 100 ? this.move() : this.stop()
    }
}
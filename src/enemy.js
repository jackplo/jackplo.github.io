import { Player } from "./Player.js"
import { Bullet } from "./bullet.js"

export class Enemy extends Player {
    constructor(x, y, color, bulletArray, player) {
        super(x, y, color, bulletArray);

        this.player = player
        this.interval = 0
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

    calculateAngle(player) {
        let enemyPos = new Point(this.base.position.x, this.base.position.y)
        let playerPos = new Point(player.base.position.x, player.base.position.y)
        let lookVector = playerPos.subtract(enemyPos)

        if (lookVector.length < 10) {
            this.velocity = 0
        }

        return lookVector.angle
    }

    death() {
        this.base.remove()
        this.lookPath.remove()
        clearInterval(this.interval)
        this.text.remove()
    }

    shoot() {
        this.interval = setInterval(() => {
            let turret_pos = this.base.position.add(new Point({angle: this.calculateAngle(this.player), length: 35}))
            this.bulletArray.push(new Bullet(turret_pos.x, turret_pos.y, 3, this.calculateAngle(this.player), this.color))
        }, 2000)
    }

    pythagorean(playerPos, enemyPos) {
        let vectorDistance = playerPos.subtract(enemyPos)
        let distance = Math.sqrt(vectorDistance.x**2 + vectorDistance.y**2)

        return distance
    }

    update() {
        let playerPos = new Point(this.player.base.position)
        let enemyPos = new Point(this.base.position)
        this.healthText()
        this.lookPath.remove()
        this.lookPath = new Path.Line(this.base.position, this.base.position.add(new Point({ angle: this.calculateAngle(this.player), length: 35 })))
        this.lookPath.sendToBack()
        this.lookPath.strokeColor = this.color
        this.lookPath.strokeWidth = 17.5

        this.pythagorean(playerPos, enemyPos) > 100 ? this.move() : this.stop()
    }
}
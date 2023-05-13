import { Enemy } from "./enemy.js"

export class spawnManager {
    constructor(xMax, yMax, player, entityArray, bulletArray) {
        this.xMax = xMax
        this.yMax = yMax
        this.player = player
        this.entityArray = entityArray
        this.bulletArray = bulletArray
        this.enemyArray = []
        this.interval = 0
    }

    spawn() {
        this.interval = setInterval(() => {
            let randomX = Math.floor(Math.random() * (this.xMax + 1))
            let randomY = Math.floor(Math.random() * (this.yMax + 1))
            let enemy = new Enemy(randomX, randomY, "red", this.player, this.bulletArray)
            enemy.shoot()
            this.enemyArray.push(enemy)
            this.entityArray.push(enemy)
        }, 2000 + Math.floor(Math.random() * 1000))
    }

    gameUpdate(xMax, yMax) {
        for (let i = this.enemyArray.length - 1; i >= 0; i--) {
            this.enemyArray[i].update(xMax, yMax)
            if (this.enemyArray[i].lives <= 0) {
                this.enemyArray[i].death()
                this.enemyArray.splice(i, 1)
            }
        }
    }

    gameDeath() {
        clearInterval(this.interval)
        for (let i = 0; i < this.enemyArray.length; i++) {
            this.enemyArray[i].death()
        }
    }
}
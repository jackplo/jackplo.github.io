import { Player } from "./player.js"
import { spawnManager } from "./spawnManager.js"

//Global Variables
var canvas = document.getElementById("canvas");
paper.install(window);
paper.setup(canvas);

var xMax = canvas.clientWidth;
var yMax = canvas.clientHeight;
var centerPoint = new Point(xMax/2, yMax/2)


const outOfBounds = (item, clientHeight, clientWidth) => {
    return (item.position.x > clientWidth || item.position.x < 0 || item.position.y > clientHeight || item.position.y < 0)
}

const itemHitTest = (entityArray, bulletArray, clientHeight, clientWidth) => {
    let options = {
        fill: true,
        tolerance: 0
    }

    for (let i = entityArray.length - 1; i >= 0; i--) {
        for (let j = bulletArray.length - 1; j >= 0; j--) {
            if (i === 0) {
                bulletArray[j].update()
            }
            let hitResult = entityArray[i].base.hitTest(bulletArray[j].bulletPos, options)
            if (hitResult != null) {
                if (entityArray[i].color !== bulletArray[j].origin) {
                    entityArray[i].lives -= 1
                    bulletArray[j].bulletShape.remove()
                    bulletArray.splice(j, 1)
                }
            }
            if (bulletArray[j] && outOfBounds(bulletArray[j].bulletShape, clientHeight, clientWidth)) {
                bulletArray[j].bulletShape.remove()
                bulletArray.splice(j, 1)
            }
        }
        if (entityArray[i].lives <= 0) {
            entityArray[i].death()
            entityArray.splice(i, 1)
        }
    }
}

const start = () => {
    let bulletArray = []
    var player = new Player(centerPoint.x, centerPoint.y, "blue", bulletArray)
    var entityArray = [player]
    
    var spawner = new spawnManager(xMax, yMax, player, entityArray, bulletArray)
    spawner.spawn()

    view.onMouseMove = function(event) { 
        player.rotate(event.point)
        player.lookDir()
    }

    view.onKeyDown = function(event) {
        if (event.key === 'w') {
            player.accelerate(1)
        } 
        if (event.key === 's') {
            player.decelerate(-1)
        } 
    }

    view.onKeyUp = function(event) {
        if (event.key === "space") {
            player.shoot()
        }
    } 

    view.onFrame = function () {
        spawner.gameUpdate(xMax, yMax)
        player.update()

        //perform a hitTest on every entity for every bullet
        itemHitTest(entityArray, bulletArray, yMax, xMax)
        if (player.lives <= 0) {
            player.death()
            spawner.gameDeath()
            
            project.activeLayer.removeChildren();
            start(xMax, yMax, centerPoint)
        }
    }
}


window.onload = function () {
    const container = document.getElementById('container')
    canvas.style.display = 'none'
    document.getElementById('btn').onclick = function() {
        container.style.display = 'none'
        canvas.style.display = 'block'
        start();
    }
}
export class Bullet {
    constructor(x, y, velocity, angle, origin) {
        this.velocity = velocity
        this.angle = angle
        
        this.bulletShape = Path.Circle({
            center: new Point(x, y),
            radius: 10,
            fillColor: "black"
        })

        this.bulletPos = 0
        this.origin = origin
    }

    update() {
        this.bulletShape.position.x = this.bulletShape.position.add(new Point({angle: this.angle, length: this.velocity})).x
        this.bulletShape.position.y = this.bulletShape.position.add(new Point({angle: this.angle, length: this.velocity})).y
        this.bulletPos = new Point(this.bulletShape.position.x, this.bulletShape.position.y)
    }

    outOfBounds(clientHeight, clientWidth) {
        return (this.bulletShape.position.x > clientWidth || this.bulletShape.position.y > clientHeight)
    }
};
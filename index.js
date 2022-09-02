// var rAF = function () {
//   return (
//     window.requestAnimationFrame ||
//     window.webkitRequestAnimationFrame ||
//     function (callback) {
//       window.setTimeout(callback, 1000 / 60);
//     }
//   );
// }();
//
// var frame = 0;
// var allFrameCount = 0;
// var lastTime = Date.now();
// var lastFameTime = Date.now();
//
// var loop = function () {
//   var now = Date.now();
//   var fs = (now - lastFameTime);
//   var fps = Math.round(1000 / fs);
//
//   lastFameTime = now;
//   // 不置 0，在动画的开头及结尾记录此值的差值算出 FPS
//   allFrameCount++;
//   frame++;
//
//   if (now > 1000 + lastTime) {
//     var fps = Math.round((frame * 1000) / (now - lastTime));
//     console.log(`${new Date()} 1S内 FPS：`, fps);
//     frame = 0;
//     lastTime = now;
//   };
//
//   rAF(loop);
// }
//
// loop();

alert('a:向左移动，d:向右移动，空格发射子弹')

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight
let score = document.querySelector('.score')
let life = document.querySelector('.life')

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = './images/plane.png'
    image.onload = () => {
      this.image = image
      this.position = {
        x: canvas.width / 2 - this.image.width / 2,
        // x: canvas.width / 2 - this.image.width / 2,
        y: canvas.height - 80
      }
    }
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height)
  }

  update() {
    if (this.image) {
      this.draw()
      this.position.x += this.velocity.x
    }
  }
}

class Bullet {
  constructor({position}) {
    this.velocity = {x: 0, y: -4}
    this.width = 4
    this.height = 10
    this.position = {
      x: position.x - this.width / 2,
      y: position.y
    }
  }

  draw() {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
    this.position.y += this.velocity.y
  }
}

class Invader {
  constructor({position, imageSrc}) {
    this.velocity = {
      x: 0, y: 0
    }
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      this.image = image
      this.position = {
        x: position.x,
        y: position.y
      }
      this.width = image.width
      this.height = image.height
      this.grid = true
    }
  }

  draw() {
    if (this.image) {
      ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
  }

  update({velocity}) {
    if (this.image && this.grid) {
      this.draw()
      this.position.x += velocity.x
      this.position.y += velocity.y
    } else {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0, y: 0
    }
    this.velocity = {
      x: 2, y: 0
    }
    this.gridWidth = 0
    this.invaders = [[], [], [], [], [], []]
    const invaderBlue = new Image()
    invaderBlue.src = './images/bee_blue.png'
    const invaderGreen = new Image()
    invaderGreen.src = './images/bee_green.png'
    const invaderRed = new Image()
    invaderRed.src = './images/bee_red.png'
    const invaderYellow = new Image()
    invaderYellow.src = './images/bee_small.png'
    invaderYellow.onload = () => {
      for (let i = 0; i < 2; i++) {
        this.invaders[0].push(new Invader({
          position: {
            x: i * 50 + 200,
            y: 50
          },
          imageSrc: invaderYellow.src
        }))
      }
    }
    invaderRed.onload = () => {
      for (let i = 0; i < 6; i++) {
        this.invaders[1].push(new Invader({
          position: {
            x: i * 50 + 100,
            y: 100
          },
          imageSrc: invaderRed.src
        }))
      }
    }
    invaderBlue.onload = () => {
      for (let i = 0; i < 8; i++) {
        this.invaders[2].push(new Invader({
          position: {
            x: i * 50 + 50,
            y: 150
          },
          imageSrc: invaderBlue.src
        }))
      }

    }
    invaderGreen.onload = () => {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 3; j++) {
          this.invaders[j + 3].push(new Invader({
            position: {
              x: i * 50,
              y: j * 50 + 200
            },
            imageSrc: invaderGreen.src
          }))
        }
      }
    }
    // console.log(this.invaders)
  }

  update() {
    this.getGridWidth()
    // 更新grid位置
    this.position.x += this.velocity.x
    // 设置速度，invader的速度与grid相同时，他们的运动就会相对静止
    if (this.position.x + this.gridWidth >= canvas.width || this.position.x < 0) {
      this.velocity.x = -this.velocity.x
    }
  }

  // 获取grid宽度
  getGridWidth() {
    let lens = 0
    this.invaders.forEach(len => {
      if (len.length > lens) lens = len.length
    })
    this.gridWidth = lens * 50
    return lens * 50
  }
}

class InvaderBullet {
  constructor({position, velocity}) {
    this.width = 4
    this.height = 10
    this.position = {
      x: position.x,
      y: position.y
    }
    this.velocity = {
      x: velocity.x,
      y: velocity.y
    }

  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
  }

  update() {
    this.draw()
    // console.log(this.position)
    this.position.y += this.velocity.y
    this.position.x += this.velocity.x
  }
}

const grid = new Grid()
let player = new Player()
const keys = {
  a: false,
  d: false
}
const playerBullets = []
const bgImg = new Image()
const invaderBullets = []
// 敌人子弹下移倍数
const invaderBulletVelocityRate = 2
// 敌机下移倍数
const invaderVelocityRate = 1
// 子弹间隔时间判断
let spaceFlag = true
let lifeFlag = false
bgImg.src = './images/background.png'


function Animate() {

  if (parseInt(life.innerHTML) === 0 && !lifeFlag) {
    lifeFlag = true
    setTimeout(() => {
      alert('你的生命已经为0，你的分数是：' + score.innerHTML)
      location.reload()
    }, 500)
  }
  if (grid.invaders.length === 0) {
    lifeFlag = true
    setTimeout(() => {
      alert('恭喜你，你赢了，你的分数是：' + score.innerHTML)
      location.reload()
    }, 500)
  }
  if (lifeFlag) return
  requestAnimationFrame(Animate)
  // background img
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, innerWidth, innerHeight)
  }
  player.update()
  // player bullet
  playerBullets.forEach((playerBullet, index) => {
    if (playerBullet.position.y + playerBullet.height <= 0) {
      playerBullets.splice(index, 1)
    } else {
      playerBullet.update()
    }
  })

  grid.update()
  grid.invaders.forEach((el, j) => {
    el.forEach((invader, i) => {
      setTimeout(() => {
        // 子弹与敌机相碰
        playerBullets.forEach((pB, p) => {
          if (pB.position.y >= invader.position.y
            && pB.position.y <= invader.position.y + invader.height
            && pB.position.x >= invader.position.x
            && pB.position.x <= invader.position.x + invader.width
            && !invader.grid
          ) {
            // 删除子弹和敌机
            el.splice(i, 1)
            playerBullets.splice(p, 1)
            score.innerHTML -= -200
            setTimeout(() => {
              invaderMove()
            }, 1000)
            // 子弹打到grid上 子弹消失
          } else if (pB.position.y >= invader.position.y
            && pB.position.y <= invader.position.y + invader.height
            && pB.position.x >= invader.position.x
            && pB.position.x <= invader.position.x + invader.width
            && invader.grid
          ) {
            playerBullets.splice(p, 1)
          }
        })
        // 敌机与我方飞机相撞
        if (
          !invader.grid &&
          invader.position.x >= player.position.x &&
          invader.position.x <= player.position.x + player.image.width &&
          invader.position.y >= player.position.y &&
          invader.position.y <= player.position.y + player.image.height ||
          !invader.grid &&
          invader.position.x + invader.width >= player.position.x &&
          invader.position.x + invader.width <= player.position.x + player.image.width &&
          invader.position.y >= player.position.y &&
          invader.position.y <= player.position.y + player.image.height
        ) {
          el.splice(i, 1)
          score.innerHTML -= 500
          life.innerHTML -= 1
          setTimeout(() => {
            invaderMove()
          }, 1000)
        }
        // 向下飞的飞机 离开屏幕视线时移除飞机
        if (invader.position.y + invader.height >= canvas.height && !invader.grid) {
          console.log(32323)
          score.innerHTML -= 500
          el.splice(i, 1)
          invaderMove()
        }
        // 设置与grid速度相同
        invader.update({velocity: {x: grid.velocity.x, y: grid.velocity.y}})
      }, 0)
      invader.draw()
    })
  })
  // 敌机子弹
  invaderBullets.forEach((bullet, index) => {
    if (
      bullet.position.x >= player.position.x &&
      bullet.position.x <= player.position.x + player.image.width &&
      bullet.position.y >= player.position.y &&
      bullet.position.y <= player.position.y + player.image.height
    ) {
      life.innerHTML -= 1
      score.innerHTML -= 500
      player.position.x = -100
      player.position.y = -100
      invaderBullets.splice(index, 1)
      setTimeout(() => {
        player = new Player()
      }, 1000)
    }
    // 子弹离开屏幕视线 移除子弹
    if (bullet.position.y > canvas.height) {
      invaderBullets.splice(index, 1)
    } else {
      bullet.update()
    }
  })
  // console.log(3232)
  // 键盘事件,左右移动不能离开屏幕视线
  if (keys.a && player.position.x >= 0) {
    player.velocity.x = -3
  } else if (keys.d && player.position.x <= canvas.width - player.image.width) {
    player.velocity.x = 3
  } else {
    player.velocity.x = 0
  }
}

Animate()

setTimeout(() => {
  invaderMove()
}, 3000)

function invaderMove() {
  // 当数组为空时，删除数组
  grid.invaders.forEach((arr, i) => {
    if (arr.length <= 0) grid.invaders.splice(i, 1)
  })
  grid.invaders[grid.invaders.length - 1][0].grid = false
  if (grid.invaders[grid.invaders.length - 1][0].position.x >= player.position.x) {
    grid.invaders[grid.invaders.length - 1][0].velocity.x = -(Math.abs(grid.invaders[grid.invaders.length - 1][0].position.x - player.position.x) /
      Math.abs(grid.invaders[grid.invaders.length - 1][0].position.y - player.position.y)) * invaderVelocityRate
  } else if (grid.invaders[grid.invaders.length - 1][0].position.x < player.position.x) {
    grid.invaders[grid.invaders.length - 1][0].velocity.x = Math.abs(grid.invaders[grid.invaders.length - 1][0].position.x - player.position.x) /
      Math.abs(grid.invaders[grid.invaders.length - 1][0].position.y - player.position.y) * invaderVelocityRate
  }
  grid.invaders[grid.invaders.length - 1][0].velocity.y = 1
  setTimeout(() => {
    // 判断向下的敌人有没有死亡
    if (!grid.invaders[grid.invaders.length - 1][0].grid) {
      invaderBullets.push(new InvaderBullet({
        position: {
          x: grid.invaders[grid.invaders.length - 1][0].position.x + grid.invaders[grid.invaders.length - 1][0].width / 2,
          y: grid.invaders[grid.invaders.length - 1][0].position.y + grid.invaders[grid.invaders.length - 1][0].height
        },
        velocity: {
          x: grid.invaders[grid.invaders.length - 1][0].velocity.x * invaderBulletVelocityRate,
          y: grid.invaders[grid.invaders.length - 1][0].velocity.y * invaderBulletVelocityRate
        }
      }))
    }

  }, 1000)


}

// 键盘监听事件
window.addEventListener('keydown', ({key}) => {
  switch (key) {
    case 'a':
      keys.a = true
      break
    case 'd':
      keys.d = true
      break
    case ' ':
      // 子弹间隔时间判断
      if (spaceFlag) {
        spaceFlag = false
        playerBullets.push(new Bullet({
          position: {
            x: player.position.x + player.image.width / 2,
            y: player.position.y
          }
        }))
        setTimeout(() => {
          spaceFlag = true
        }, 500)
      }

  }
})
window.addEventListener('keyup', ({key}) => {
  switch (key) {
    case 'a':
      keys.a = false
      break
    case 'd':
      keys.d = false
  }
})
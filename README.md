# 红包雨 报红包

使用 Phaserjs3 + TS

## 启动

```
npm start
```

<!-- ![截图](https://s2.ax1x.com/2020/01/13/lHRD1A.jpg) -->

## 开发步骤

### 初始化画布

设置 `type` 为 `AUTO`， `Phaser` 引擎将优先使用 `WebGL`，如果不支持，则退回使用 `Canvas`

设置 `autoCener` 为 `WIDTH_CONTROLS_HEIGHT`， 将以宽度优先，自动调整高度，具体相关屏幕适配，可以参考[官方适配文档](http://labs.phaser.io/index.html?dir=scalemanager/&q=)

选择物理引擎为轻量级的 `arcade`，设置重力为 200，值越大，重力加速度越快

```ts
const app = new Phaser.Game({
  type: Phaser.AUTO,
  // 根据宽度自动调整宽度
  autoCenter: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
  backgroundColor: '#4D3C5E',
  width: 375,
  height: 667,
  // 场景列表，默认显示第一个
  scene: [Start, Play, GameOver],

  // 配置物理引擎
  physics: {
    default: 'arcade',
    arcade: {
      // 重力加速度
      gravity: { y: 200 }
    }
  }
});
```

### 初始化三个场景

建立 3 个场景： 开始、游戏、结束

### 开始场景

#### 交互逻辑

点击红包 - 倒计时 - 自动进入游戏

#### 代码逻辑

- 加载所有资源（preload)
- 显示背景
- 初初始化音频
- 初始化 帧动画（animations）引导点击动画 和 空红包打开动画
- 添加倒计时精灵，默认隐藏
- 设置倒计时，默认暂停
- 添加红包精灵，注册点击事件，点击时 `开始游戏`

开始游戏

- 播放音效
- 倒计时，切换显示 `counter` 的每一帧 `sprite.setFrame(0)`
- 倒计时结束，进入游戏

#### 涉及到的 API

资源加载

- `this.load.image` 加载普通图
- `this.load.spritesheet` 加载精灵图(单帧或多帧图)
- `this.load.audio` 加载音频

资源添加

- `this.add.sprite` 初始化精灵图
- `this.sound.add` 初始化音频

定时器

`this.time.addEvent` 添加定时器

`this.time.paused = ture / false` 可以暂停或开始计时

帧动画

`this.anims.create` 配置帧动画

### 游戏场景

#### 交互逻辑

- 点击红包
- 中奖：显示红包 - 点击打开 - 显示中奖内容 - 继续或结束
- 未中奖：显示红包为空的状态

#### 代码逻辑

相关函数

```js
{
  // ----- 重写继承的函数
  init(){}
  create(){}
  update(){}

  // ----- 自定义的函数
  // 实始化红包内容弹层
  initPrizeDialog(){}
  // 显示中奖内容弹层
  showPrize(){}

  // 初始化定时器
  initTimer(){}
  // 倒计时
  countdown(){}
  // 生成红包
  createRedPkg(){}

  // 初始化中奖弹层
  initSuccessDialog(){}
  // 显示红包内容弹层
  showSuccessDialog(){}

  // 初始化未中奖弹层
  initFailDialog(){}
  // 显示未中奖弹层
  showFailDialog(){}

  // 开始
  startRain(){}
  // 暂停
  pauseRain(){}
}
```

初始化

- 初始化配置参数：奖品列表、是否已经开始、倒计时时间、奖品名称等
- 添加背景
- 添加音频
- 设置红包对象池（便于复用，提升性能），最大数量为 100
- 初始化倒计时文本
- 初始化 未中奖弹出层（默认隐藏）
- 初始化 已中奖弹出层（默认隐藏）
- 初始化 红包内容弹出层（默认隐藏）
- 初始化定时器(红包生成与倒计时)（默认暂停）

开始游戏

- 开启定时器，`isStar` 为 `true`，开启物理引擎
- 生成红包，自由下落，倒计时开始

暂停逻辑与 开始游戏 相同，只是开关而已

点击红包

中奖判断：

随机一个数组索引，如果索引在奖品列表中，则中奖，否则未中奖

中奖：暂停红包雨，删除已中奖品，设置奖品名称，播放中奖音效，显示中奖红包并播放显示动画，将奖品添加到已中奖列表中去

点击打开红包：显示中奖内容

未中奖：播放空的红包动画

倒计时结束：

如果中奖列表有奖品，则到结果页显示奖品，如果没有，则提示未中奖

#### 涉及到的 API

- `this.physics.add.group` 生成红包对象池，提升性能
- `this.add.container` 设置容器，方便多个 `sprite` 组合成一个整体，以便添加动画效果和定位等
- `this.tweens.add` 添加补间动画

#### 技术要点

`sprite.setDepth(10)` 设置精灵的层级，有时候动态添加的精灵会覆盖原有的图层，通过设置层级可以调整图层

`container` 的应用，方便添加动画，如果使用 `group`, 在添加 `tween` 动画时，会应用到 `group` 中的每一个元素，如果多个元素在一个 `container` 内，则动画会作用于 `continer` ，同时 container 也便于设置元素组的属性，比如缩放等

`this.physics.resume()` 与 `this.physics.pause()` 用于恢复和暂停物理引擎，方便在动画过程中控制动画的播放和暂停

`sprite.setInteractive()` 精灵在添加事件之前，要先激活，否则事件无法注册

`init` 方法可用于 场景传参和场景初始化，相当于 `vue` 的 `beforeCreate`

### 结束场景

这里可以根据具体的业务处理相关展示逻辑，一般放抽奖结果展示，和引导用户关注或购买

相关代码请看 [GitHub]()

参考

- [全新 Phaser 3 游戏引擎特性一览](https://aotu.io/notes/2018/12/23/phaser3/)
- [仿淘宝,京东红包雨(基于 Phaser 框架)](https://www.cnblogs.com/mianbaodaxia/p/7095782.html)

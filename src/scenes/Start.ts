import Phaser from 'phaser';
import { resources } from './config';

export default class StartScene extends Phaser.Scene {
  countdownTime: 0;
  counter: Phaser.GameObjects.Sprite;
  countdownAudio: Phaser.Sound.BaseSound;
  constructor() {
    super('start');
  }

  init() {
    this.countdownTime = 0;
  }

  preload() {
    resources.forEach(v => {
      const { name, url, type, ...options } = v;
      if (type === 'image') {
        this.load.image(name, url);
      } else if (type === 'spriteSheet') {
        this.load.spritesheet(name, url, options as any);
      } else if (type === 'audioSprite') {
        this.load.audio(name, url);
      }
    });
  }

  create() {
    const canvasW = this.game.canvas.width;
    const canvasH = this.game.canvas.height;

    // 设置背景
    this.add.sprite(canvasW / 2, canvasH / 2, 'bgPlan').setScale(0.5);

    // 添加音频
    this.countdownAudio = this.sound.add('audioCountDown');

    // 初始化 帧动画
    this.initAnimations();

    // 显示红包 & 添加点击开始游戏事件
    const redpkg = this.add.sprite(canvasW / 2, canvasH / 2 + 17, 'redpacket').setScale(0.5);

    // 播放引导点击动画
    const courseHandle = this.add.sprite(canvasW / 2, canvasH / 2 + 60, 'cursorAnimation', 0).setScale(0.5);
    courseHandle.play('cursorGuide');

    // 倒计时
    this.counter = this.add
      .sprite(canvasW / 2, canvasH / 2 - 160, 'imgjishi', 0)
      .setScale(0.5)
      .setVisible(false);

    // 定时器
    this.time.addEvent({ delay: 1000, callback: this.updateCounter, loop: true });
    this.time.paused = true;

    // 点击开始
    redpkg.setInteractive().on('pointerup', () => {
      this.startGame();
      courseHandle.setVisible(false);
    });
  }

  // 开始游戏
  startGame() {
    // 播放音效
    this.counter.setVisible(true);
    this.time.paused = false;
    this.countdownAudio.play();
  }

  // 播放倒计时
  updateCounter = () => {
    if (this.countdownTime < 3) {
      this.countdownTime++;
      this.counter.setFrame(this.countdownTime);
    } else {
      this.scene.start('play');
    }
  };

  // 初始化 帧动画
  initAnimations() {
    this.anims.create({
      key: 'cursorGuide',
      frames: this.anims.generateFrameNumbers('cursorAnimation', { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'openRedPkg',
      frames: this.anims.generateFrameNumbers('redpacket', { start: 0, end: 1 }),
      frameRate: 16
    });
  }
}

// this.anims.create({
//     key: 'countdown',
//     frames: this.anims.generateFrameNumbers('imgjishi', {start: 0, end: 3}),
//     frameRate: 1,
// });

// 倒计时
// this.counter = this.add.text(canvasW / 2, canvasH / 2 - 140, String(this.countdownTime), {
//   fontSize: '100px',
//   fill: '#fff',
//   fontWeight: 'bolder',
//   fontFamily: 'Arial'
// });
// this.counter.setOrigin(0.5, 0.5).setScale(0.5);

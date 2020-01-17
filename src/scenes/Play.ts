import Phaser from 'phaser';

export default class PlayScene extends Phaser.Scene {
  redpkgGroup: Phaser.Physics.Arcade.Group;
  openAudio: Phaser.Sound.BaseSound;
  prize: string[];

  isStart: boolean;
  centerX: number;
  centerY: number;

  redpkg: Phaser.GameObjects.Sprite;
  btnOpen: Phaser.GameObjects.Sprite;
  failDialog: Phaser.GameObjects.Sprite;

  pkgContainer: Phaser.GameObjects.Container;
  prizeContainer: Phaser.GameObjects.Container;
  prizeText: string;

  counterText: Phaser.GameObjects.Text;

  // 已中奖列表
  winningList: string[];

  // 倒计时
  counter: number;
  constructor() {
    super('play');
  }

  init() {
    console.log('init');
    this.prize = ['全场优惠50元', '20元代金券', '全场优惠50元', '20元代金券', '全场优惠50元', '20元代金券'];
    this.isStart = false;
    this.prizeText = '全场优惠50元';
    this.counter = 15;
    this.winningList = [];
  }

  create() {
    const canvasW = this.game.canvas.width;
    const canvasH = this.game.canvas.height;
    this.centerX = canvasW / 2;
    this.centerY = canvasH / 2;

    // 背景
    this.add.sprite(this.centerX, this.centerY, 'bgRainer').setScale(0.5);
    // 拆红包音频
    this.openAudio = this.sound.add('openaudio');
    // 红包对象池
    this.redpkgGroup = this.physics.add.group({ defaultKey: 'redpacket', maxSize: 100 });
    // 倒计时
    this.counterText = this.add
      .text(canvasW - 40, 30, this.counter + '', {
        fontSize: '80px',
        fill: '#fff',
        fontWeight: 'bolder',
        fontFamily: 'Arial',
        rtl: true
      })
      .setScale(0.5)
      .setDepth(12);
    // 初始化 未中奖弹出层（默认隐藏）
    this.initFailDialog();
    // 初始化 已中奖弹出层（默认隐藏）
    this.initSuccessDialog();
    // 初始化 红包内容弹出层（默认隐藏）
    this.initPrizeDialog();
    // 初始化 定时器
    this.initTimer();
    // 开始红包雨
    this.startRain();
  }

  initSuccessDialog() {
    this.pkgContainer = this.add.container(this.centerX, 0);
    const pkg = this.add.sprite(0, 0, 'openRedpacket');
    const btnOpen = this.add.sprite(0, 80, 'open').setInteractive();
    this.pkgContainer.add(pkg);
    this.pkgContainer.add(btnOpen);
    this.pkgContainer.setScale(0.5);
    btnOpen.on('pointerup', () => {
      this.pkgContainer.setActive(false).setVisible(false);
      this.showPrize();
    });
    this.pkgContainer.setActive(false).setVisible(false);
  }

  initPrizeDialog() {
    this.prizeContainer = this.add.container(this.centerX, this.centerY);
    const getResBg = this.add.sprite(0, 0, 'redpacketResult');
    const btnLeft = this.add.sprite(-120, 300, 'buttonUseTicket').setInteractive();
    const btnRight = this.add.sprite(120, 300, 'buttonContinue').setInteractive();
    const tipText = this.add
      .text(0, 65, this.prizeText, {
        fontSize: '46px',
        fill: '#ffe67d',
        fontWeight: 'bolder',
        fontFamily: 'Arial'
      })
      .setOrigin(0.5, 0.5);

    this.prizeContainer.add(getResBg);
    this.prizeContainer.add(tipText);
    this.prizeContainer.add(btnLeft);
    this.prizeContainer.add(btnRight);

    btnLeft.on('pointerdown', () => {
      btnLeft.setTint(0xbce285);
    });
    btnRight.on('pointerdown', () => {
      btnRight.setTint(0xbce285);
    });
    btnLeft.on('pointerup', () => {
      btnLeft.clearTint();
      // 结束
      this.scene.start('gameover');
    });
    btnRight.on('pointerup', () => {
      // 继续
      btnRight.clearTint();
      this.prizeContainer.setActive(false).setVisible(false);
      this.startRain();
    });

    this.prizeContainer.setActive(false).setVisible(false);
  }

  // 显示红包
  showSuccessDialog() {
    this.pkgContainer
      .setActive(true)
      .setVisible(true)
      .setDepth(10);
    this.tweens.add({
      targets: this.pkgContainer, //tweens动画目标
      ease: 'Bounce', //运动方式
      y: this.centerY, // 目标的y坐标,
      duration: 1000 //动画时间
    });
  }

  // 显示奖品
  showPrize() {
    this.prizeContainer
      .setActive(true)
      .setVisible(true)
      .setDepth(11);
    this.prizeContainer.getAt(1).setText(this.prizeText);
    // 显示动画
    this.tweens.add({
      targets: this.prizeContainer, //tweens动画目标
      scaleX: 0.5,
      scaleY: 0.5,
      ease: 'power2', //运动方式
      duration: 350 //动画时间
    });
  }

  initTimer() {
    // 每 200ms 随机生成一个红包
    this.time.addEvent({ delay: 200, loop: true, callback: this.createRedPkg });
    this.time.addEvent({ delay: 1000, loop: true, callback: this.countdown });
    this.time.paused = true;
  }

  countdown = () => {
    if (this.counter > 0) {
      this.counter--;
      this.counterText.setText(this.counter + '');
    } else {
      this.pauseRain();
      // 游戏结束
      if (this.winningList.length === 0) {
        // 未中奖
        this.showFailDialog();
      } else {
        // 已中奖
        this.scene.start('gameover');
      }
    }
  };

  initFailDialog() {
    this.failDialog = this.add.sprite(this.centerX, this.centerY, 'dialogExit');
    this.failDialog
      .setScale(0.5)
      .setActive(false)
      .setVisible(false)
      .setDepth(10)
      .setInteractive();
    this.failDialog.on('pointerup', () => {
      this.scene.start('start');
    });
  }

  showFailDialog = () => {
    this.failDialog.setVisible(true).setActive(true);
  };

  startRain() {
    this.time.paused = false;
    this.isStart = true;
    this.physics.resume();
  }

  pauseRain() {
    this.physics.pause();
    this.time.paused = true;
    this.isStart = false;
  }

  update() {
    if (this.isStart) {
      // 红包超出界面后，回收
      this.redpkgGroup.children.iterate((v: Phaser.Physics.Arcade.Sprite) => {
        if (v.y > this.game.canvas.height) {
          v.setFrame(0);
          this.redpkgGroup.killAndHide(v);
        }
      });
    }
  }

  createRedPkg = () => {
    const pkg: Phaser.Physics.Arcade.Sprite = this.redpkgGroup.get(
      Phaser.Math.Between(this.game.canvas.width / 2 - 50, this.game.canvas.width + 50),
      Phaser.Math.Between(-120, -50)
    );
    if (!pkg) return;
    pkg.setScale(0.5);
    pkg.setVisible(true);
    pkg.setActive(true);
    // 旋转 30 度
    pkg.setAngle(30);
    // 设置 x,y 方向的速度
    pkg.setVelocity(-100 * Math.random(), 300 * Math.random());

    // 添加 点击 事件
    pkg.setInteractive();
    pkg.once('pointerdown', () => {
      // 随机一个数组索引
      const idx = Math.floor(Phaser.Math.Between(0, 200));
      // 如果中奖
      if (this.prize[idx]) {
        // 停止 红包雨
        this.pauseRain();
        this.prizeText = this.prize[idx];
        console.log('你中奖了: ' + this.prizeText);
        // 删除奖项，一个奖项只能中一次
        this.prize.splice(idx, 1);
        // 添加到已中奖列表
        this.winningList.push(this.prizeText);
        // 播放音效
        this.openAudio.play();
        // 显示红包
        this.showSuccessDialog();
      } else {
        console.log('未中奖');
        pkg.play('openRedPkg');
      }
    });
  };
}

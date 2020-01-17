import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameover');
  }

  create() {
    const canvasW = this.game.canvas.width;
    const canvasH = this.game.canvas.height;
    const centerX = canvasW / 2;
    const centerY = canvasH / 2;

    // 背景
    this.add.sprite(centerX, centerY, 'bgRainer').setScale(0.5);

    this.add
      .text(centerX, centerY, '谢谢参与', {
        fontSize: '100px',
        fill: '#fff',
        fontWeight: 'bolder',
        fontFamily: 'Arial'
      })
      .setScale(0.5)
      .setOrigin(0.5, 0.5);

    this.add
      .sprite(centerX, centerY + 60, 'buttonContinue')
      .setScale(0.5)
      .setInteractive()
      .on('pointerup', () => {
        this.scene.start('start');
      });
  }
}

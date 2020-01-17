import Phaser from 'phaser';
import Start from './scenes/Start';
import Play from './scenes/Play';
import GameOver from './scenes/GameOver';

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

export default app;

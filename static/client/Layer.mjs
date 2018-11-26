import { dimensions } from './canvas.mjs';

export default class Layer {
  constructor(options = {}) {
    const { index } = options;
    this.moduleSpecifier;
    this.animation;
    this.disable();

    this.clientPositionData = {};

    if ('undefined' !== typeof index) {
      this.index = index;
    }
  }

  setProperties(properties) {
    // console.log(properties);
    if (properties && this.animation) {
      for (let key in properties) {
        const priorValue = this.animation[key];
        // console.log(priorValue);
        if ('number' === typeof priorValue) {
          this.animation[key] = Number(properties[key]);
        }
      }
    }
  }

  load(args) {
    const { moduleSpecifier, properties } = args;

    if (moduleSpecifier) {
      this.disable();
      import(moduleSpecifier).then(mod => {
        this.animation = new mod.default(this.clientPositionData, dimensions, {
          timestamp: new Date().getTime()
        });
        this.setProperties(properties);
      });
    }
  }

  setAnimation(Animation, overrideDisable = false) {
    this.animation = new Animation();
    if (!overrideDisable) {
      this.disable();
    }
  }

  restart() {
    this.animation && this.animation.restart();
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  blackOutOn() {
    this._isEnabled = this.isEnabled;
    this.disable();
  }

  blackOutOff() {
    this.isEnabled = this._isEnabled;
    delete this._isEnabled;
  }

  clear() {
    this.animation = null;
  }

  setClientPosition(args) {
    this.clientPositionData = args;
  }

  render(ctx, ts, audioInfo) {
    if (this.isEnabled && this.animation) {
      this.animation.render(ctx, ts, audioInfo);
    }
  }
}

export default class Layer {
  constructor(options = {}) {
    const { index } = options;
    this.moduleId;
    this.animation;
    this.disable();

    this.clientPosition = {};

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
    const { moduleId, properties } = args;

    if (moduleId) {
      this.disable();
      import(moduleId).then(mod => {
        this.animation = new mod.default(this.clientPosition);
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
    // console.log(args);
    this.clientPosition = args;
  }

  render(ctx, screen, audioInfo) {
    if (this.isEnabled && this.animation) {
      this.animation.render(ctx, screen, audioInfo);
    }
  }
}

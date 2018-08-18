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

  setParameters(parameters) {
    console.log(parameters);
    if (parameters && this.animation) {
      for (let key in parameters) {
        const priorValue = this.animation[key];
        console.log(priorValue);
        if ('number' === typeof priorValue) {
          this.animation[key] = Number(parameters[key]);
        }
      }
    }
  }

  load(args) {
    const { moduleString, parameters } = args;

    if (moduleString) {
      // when Chromium gets dynamic module loading this can be replaced by an import()
      const evaluated = new Function(moduleString)();
      this.animation = new evaluated(this.clientPosition);
      this.disable();
    }
    this.setParameters(parameters);
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
    this.clientPosition = args;
  }

  render(ctx, screen) {
    if (this.isEnabled && this.animation) {
      this.animation.render(ctx, screen);
    }
  }
}

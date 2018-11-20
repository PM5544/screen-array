import { empty } from '../dom.mjs';
import * as events from '../events.mjs';
import allAnimations from '../animations.mjs';
import './c-animation-preview.mjs';
import './c-toggle-button.mjs';
import { SCREEN_DIMENSION_HEIGHT, SCREEN_DIMENSION_WIDTH } from '../../constants.mjs';

const styleContent = `
* {
  box-sizing: border-box;
}
:host {
  font-family: var(--font-family);
}
:host > .tags {
  display: flex;
}
button {
  -webkit-appearance: none;
  background: #333;
  color: var(--font-color);
  border: 1px solid var(--border-color);
  border-radius: 2px;
  cursor: pointer;
}
.tags {
  padding: var(--padding) 0;
  border-bottom: 1px solid var(--border-color);
}
.tags > button + button{
  margin-left: var(--padding);
}
.animations {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-rows: min-content;
  grid-gap: calc(var(--padding) * 2);
  overflow-y: auto;
}
.animations > div {
  cursor: pointer;
  height: auto;
}
.animations > div * {
  pointer-events: none;
}
.name {
  font-size: var(--font-size);
  color: var(--font-color);
  line-height: calc(var(--font-size) + 1rem);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
canvas {
  width: 100%;
  border: 1px solid var(--border-color);
}
`;

window.customElements.define(
  'c-animations-explorer',
  class extends HTMLElement {
    constructor() {
      super();

      events.listen('allAnimationData', this.populate.bind(this));

      this.attachShadow({ mode: 'open' });

      const styles = document.createElement('style');
      styles.textContent = styleContent;
      this.shadowRoot.appendChild(styles);

      this.tags = document.createElement('div');
      this.tags.className = 'tags';

      this.animations = document.createElement('div');
      this.animations.className = 'animations';
      this.animations.addEventListener('click', this.handleAnimationsClick.bind(this));

      this.shadowRoot.appendChild(this.tags);
      this.shadowRoot.appendChild(this.animations);

      // used to easilly get the animation by target in an eventHandler
      this.nodesMap = new Map();

      // collection of animations by their tags
      this.nodesByTagsMap = new Map();

      // collection of tags that are currently on
      this.tagsThatAreOn = {};

      this.reset();
    }

    reset() {
      this.nodesByTagsMap.clear();
      this.nodesMap.clear();
      this.tagsThatAreOn = {};
      empty(this.animations);
      empty(this.tags);
    }

    populate() {
      const allTags = {};

      this.reset();

      allAnimations.forEach(animation => {
        const { name, specifier, tags } = animation;
        // console.log(module, name, specifier, properties, tags);
        const a = document.createElement('div');
        tags.forEach(t => {
          allTags[t] = true;
        });

        this.nodesByTagsMap.set(
          tags.reduce((prev, cur) => ({ ...prev, [cur]: true }), Object.create(null)),
          a
        );
        this.nodesMap.set(a, animation);

        const nameNode = document.createElement('div');
        nameNode.className = 'name';
        nameNode.textContent = name;
        a.appendChild(nameNode);

        const canvas = document.createElement('canvas', { is: 'c-animation-preview' });
        canvas.setAttribute('specifier', specifier);
        canvas.width = SCREEN_DIMENSION_WIDTH * 40;
        canvas.height = SCREEN_DIMENSION_HEIGHT * 40;
        a.appendChild(canvas);

        this.animations.appendChild(a);
      });

      const tagToggle = document.createElement('button');
      tagToggle.innerText = 'toggle tags';
      tagToggle.addEventListener('click', this.toggleTags);
      this.tags.appendChild(tagToggle);

      Object.keys(allTags).forEach(tag => {
        const button = document.createElement('button', { is: 'c-toggle-button' });
        button.innerText = tag;
        button.setAttribute('property', tag);
        button.setAttribute('is-on', '');
        button.handler = this.toggleTag.bind(this);

        this.tags.appendChild(button);
        this.tagsThatAreOn[tag] = true;
      });
    }

    toggleTags(e) {
      e.preventDefault();
      let next = e.target.nextSibling;

      while (next) {
        if (next.nodeName === 'BUTTON') {
          next.click();
        }
        next = next.nextSibling;
      }
    }

    toggleTag({ property, isOn }) {
      if (isOn) {
        this.tagsThatAreOn[property] = true;
      } else {
        delete this.tagsThatAreOn[property];
      }

      hideOrShowNodesBasedOnTags({
        nodesByTagsMap: this.nodesByTagsMap,
        tagsThatAreOn: this.tagsThatAreOn
      });
    }

    handleAnimationsClick({ target }) {
      const animation = this.nodesMap.get(target);
      if (animation) {
        events.trigger('selectedAnimationToLoad', animation);
      }
    }

    connectedCallback() {
      const resize = () => {
        this.animations.style.height = `${document.documentElement.offsetHeight -
          this.animations.offsetTop -
          23}px`;
      };
      new ResizeObserver(entries => {
        for (let entry of entries) {
          resize();
        }
      }).observe(document.querySelector('c-layers'));
      resize();
    }
    disconnectedCallback() {}
    adoptedCallback() {}
  }
);

function hideOrShowNodesBasedOnTags({ nodesByTagsMap, tagsThatAreOn }) {
  const _tagsThatAreOn = Object.keys(tagsThatAreOn);

  nodesByTagsMap.forEach((node, tagsForNode) => {
    let found = false;
    for (let tagThatIsOn of _tagsThatAreOn) {
      if (tagThatIsOn in tagsForNode) {
        node.removeAttribute('hidden');
        found = true;
        break;
      }
    }
    if (!found) {
      node.setAttribute('hidden', '');
    }
  });
}

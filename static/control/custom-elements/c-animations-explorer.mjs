import templateLoader from '../../utils/template-loader.mjs';
import { empty, NodesProxy } from '../dom.mjs';
import * as events from '../events.mjs';
import allAnimations from '../animations.mjs';
import './c-animation-preview.mjs';
import './c-toggle-button.mjs';
import { SCREEN_DIMENSION_HEIGHT, SCREEN_DIMENSION_WIDTH } from '../../constants.mjs';

const name = 'c-animations-explorer';

templateLoader(name).then(content => {
  window.customElements.define(
    name,
    class extends HTMLElement {
      get name() {
        return 'Animations explorer';
      }

      constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(content.cloneNode(true));
        this.nodes = new NodesProxy(this.shadowRoot);

        this.nodes.animations.addEventListener('click', this.handleAnimationsClick.bind(this));

        // used to easilly get the animation by target in an eventHandler
        this.animationsMap = new Map();

        // collection of animations by their tags
        this.animationsByTagsMap = new Map();

        // collection of tags that are currently on
        this.tagsThatAreOn = {};

        this.reset();

        events.listen('allAnimationData', this.populate.bind(this));
      }

      reset() {
        this.animationsByTagsMap.clear();
        this.animationsMap.clear();
        this.tagsThatAreOn = {};
        empty(this.nodes.animations);
        empty(this.nodes.tags);
      }

      populate() {
        const allTags = {};

        this.reset();

        allAnimations.forEach(animation => {
          const { name, specifier, tags } = animation;
          const a = document.createElement('div');

          tags.forEach(t => {
            allTags[t] = true;
          });

          this.animationsByTagsMap.set(
            tags.reduce((prev, cur) => ({ ...prev, [cur]: true }), Object.create(null)),
            a
          );
          this.animationsMap.set(a, animation);

          const nameNode = document.createElement('div');
          nameNode.className = 'name';
          nameNode.textContent = name;
          a.appendChild(nameNode);

          const canvas = document.createElement('canvas', { is: 'c-animation-preview' });
          canvas.setAttribute('specifier', specifier);
          canvas.width = SCREEN_DIMENSION_WIDTH * 40;
          canvas.height = SCREEN_DIMENSION_HEIGHT * 40;
          a.appendChild(canvas);

          this.nodes.animations.appendChild(a);
        });

        const tagToggle = document.createElement('button');
        tagToggle.innerText = 'toggle tags';
        tagToggle.addEventListener('click', this.toggleTags);
        this.nodes.tags.appendChild(tagToggle);

        Object.keys(allTags).forEach(tag => {
          const button = document.createElement('button', { is: 'c-toggle-button' });
          button.innerText = tag;
          button.setAttribute('property', tag);
          button.setAttribute('is-on', '');
          button.handler = this.toggleTag.bind(this);

          this.nodes.tags.appendChild(button);
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
          animationsByTagsMap: this.animationsByTagsMap,
          tagsThatAreOn: this.tagsThatAreOn
        });
      }

      handleAnimationsClick({ target }) {
        const animation = this.animationsMap.get(target);
        if (animation) {
          events.trigger('selectedAnimationToLoad', animation);
        }
      }
    }
  );

  function hideOrShowNodesBasedOnTags({ animationsByTagsMap, tagsThatAreOn }) {
    const _tagsThatAreOn = Object.keys(tagsThatAreOn);

    animationsByTagsMap.forEach((node, tagsForNode) => {
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
});

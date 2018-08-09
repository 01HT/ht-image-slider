"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-icon-button";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
// import "./jquery";
import { owlCarouselMin } from "./styles.owl.carousel.min.js";
import { owlThemeDefaultMin } from "./styles.owl.theme.default.min.js";
import "./jquery.min.js";
window.$ = $;
window.jQuery = jQuery;
import "./owl.carousel.min.js";

class HTImageSlider extends LitElement {
  _render({ data }) {
    return html`
      ${owlCarouselMin}
      ${owlThemeDefaultMin}
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
          overflow:hidden;
        }

        paper-icon-button {
          color:#fff;
          filter:drop-shadow(0 0 2px hsl(0,0%,10%));
        }

        .nav-button {
          position: absolute;
          top: calc(50% - 20px);
          border-radius:50%;
          margin:0 8px;
          cursor: pointer;
          transition: .4s;
        }

        #container:hover .nav-button {
          background: rgba(51,51,51,.6);
        }

        #container:hover .nav-button:hover {
          background:#333;
        }
        
        #previous {
          left: 0;
        }

        #next {
          right: 0;
        }
      </style>
      <iron-iconset-svg size="24" name="ht-image-slider">
        <svg>
            <defs>
                <g id="chevron-left"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></g>
                <g id="chevron-right"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></g>
            </defs>
        </svg>
    </iron-iconset-svg>
    <div id="container"></div>
`;
  }

  static get is() {
    return "ht-image-slider";
  }

  static get properties() {
    return {
      data: Object,
      url: String
    };
  }

  _didRender() {
    let owl = this.shadowRoot.querySelector(".owl-carousel");
    if (owl !== null) $(owl).owlCarousel("destroy");
    const container = this.shadowRoot.querySelector("#container");
    container.innerHTML = "";

    owl = document.createElement("div");
    owl.classList.add("owl-carousel", "owl-theme");

    let data = this.data;
    for (let itemId in data) {
      let item = data[itemId];
      let img = document.createElement("img");
      img.src = `${window.cloudinaryURL}/image/upload/c_scale,f_auto,w_1024/v${
        item.version
      }/${item.public_id}.jpg`;
      if (this.url) {
        let aTag = document.createElement("a");
        aTag.setAttribute("href", this.url);
        aTag.appendChild(img);
        owl.appendChild(aTag);
      } else {
        owl.appendChild(img);
      }
    }
    container.appendChild(owl);

    owl = $(owl).owlCarousel({
      items: 1,
      loop: true,
      lazyLoad: true,
      center: true,
      dots: false
    });

    // Add nav buttons
    const owlStageOuter = this.shadowRoot.querySelector(".owl-stage-outer");

    const previous = document.createElement("paper-icon-button");
    previous.setAttribute("id", "previous");
    previous.classList.add("nav-button");
    previous.setAttribute("icon", "ht-image-slider:chevron-left");
    $(previous).click(_ => {
      owl.trigger("prev.owl.carousel");
    });
    owlStageOuter.appendChild(previous);

    const next = document.createElement("paper-icon-button");
    next.setAttribute("id", "next");
    next.classList.add("nav-button");
    next.setAttribute("icon", "ht-image-slider:chevron-right");
    $(next).click(_ => {
      owl.trigger("next.owl.carousel");
    });
    owlStageOuter.appendChild(next);
  }
}

customElements.define(HTImageSlider.is, HTImageSlider);

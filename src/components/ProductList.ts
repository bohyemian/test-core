import { LitElement, html, css, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import resetCSS from '../Layout/resetCSS';
import { Auth, Product } from '../@types/type';
import { getPbImageURL } from '../api/getPbImageURL';
import gsap from 'gsap';

@customElement('product-list')
class ProductList extends LitElement {
  @property({ type: Object }) data: Product = {
    items: [],
    page: 0,
    perPage: 0,
    totalItems: 0,
    totalPages: 0,
  };

  @state() loginData = {} as Auth;

  static styles: CSSResultGroup = [
    resetCSS,
    css`
      .container {
        margin: 0 auto;

        img {
          width: 100%;
        }

        ul {
          display: grid;
          align-items: baseline;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin: 2.5rem;

          li {
            a {
              display: flex;
              flex-direction: column;
              gap: 0.6rem;
            }
          }

          .description {
            overflow: hidden;
            font-size: 0.8rem;
            line-height: 1.2;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .price {
            color: gray;
            text-decoration: line-through;
          }

          .discount {
            font-size: 1.2rem;
            color: rgb(252, 93, 93);
          }

          .real-price {
            font-weight: 900;
          }
        }
      }

      .new-post {
        padding: 0.5rem 1rem;
        background-color: dodgerblue;
        color: white;
        border-radius: 20px;
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 2rem;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  async fetchData() {
    const response = await fetch(`${import.meta.env.VITE_PB_API}/collections/products/records`);
    const data = await response.json();
    this.data = data;
    this.loginData = JSON.parse(localStorage.getItem('auth') ?? '{}');
  }

  //attributeChangedCallback
  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    const item = this.renderRoot.querySelectorAll('.product-item');

    if (item.length) {
      gsap.from(item, {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        delay: 0.5,
      });
    }
  }

  render() {
    const { isAuth } = this.loginData;

    return html`
      <div class="container">
        <ul>
          ${this.data.items.map(
            (item) => html`
              <li class="product-item">
                <a href="${isAuth ? `/src/pages/detail/index.html?product=${item.id}` : `/`}">
                  <figure>
                    <img src="${getPbImageURL(item)}" alt="" />
                  </figure>
                  <span class="brand">${item.brand}</span>
                  <span class="description">${item.description}</span>
                  <span class="price">${item.price.toLocaleString()}원</span>
                  <div>
                    <span class="discount">${item.discount ? `${item.discount}%` : ''}</span>
                    <span class="real-price">${(item.price - item.price * item.discount * 0.01).toLocaleString()}원</span>
                  </div>
                </a>
              </li>
            `
          )}
        </ul>
      </div>

      <a class="new-post" href="/src/pages/newPost/">+ 상품추가</a>
    `;
  }
}

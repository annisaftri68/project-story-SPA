import createMapWithMarkers from '../utils/map';

export default class ProductList {
  render(container, products) {
    const list = document.createElement('div');
    list.className = 'product-list';

    products.forEach((product) => {
      const item = document.createElement('div');
      item.className = 'product-item';

      item.innerHTML = `
        <img src="${product.photoUrl}" alt="Gambar produk" />
        <h3>${product.description}</h3>
        <p>Dibuat oleh: ${product?.user?.name || 'Tidak diketahui'}</p>
        <small>Waktu: ${new Date(product.createdAt).toLocaleString()}</small>
      `;

      list.appendChild(item);
    });

    container.appendChild(list);

    const mapEl = document.createElement('div');
    mapEl.id = 'product-map';
    mapEl.style.height = '300px';
    container.appendChild(mapEl);

    createMapWithMarkers(mapEl, products);
  }
}
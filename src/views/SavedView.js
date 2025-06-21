export default class SavedView {
  constructor(container) {
    this.container = container;
  }

  showStories(stories) {
    this.container.innerHTML = '<h2>Saved Stories</h2>';
    if (stories.length === 0) {
      this.container.innerHTML += '<p>Belum ada cerita yang disimpan.</p>';
      return;
    }

    const list = document.createElement('div');
    list.className = 'story-list';

    stories.forEach(story => {
      const item = document.createElement('div');
      item.className = 'story-item';
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.description}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
      `;
      list.appendChild(item);
    });

    this.container.appendChild(list);
  }
}

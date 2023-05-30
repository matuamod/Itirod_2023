const cardList = document.querySelector('.search-content__list');
const sortTypeSelect = document.querySelector('#sort_by');

function SortCardList() {
  const sortType = sortTypeSelect.value;
  const listItems = Array.from(cardList.children);

  listItems.sort((a, b) => {
    const priceA = parseFloat(a.querySelector('.descr-wrap__price').textContent.replace('$', ''));
    const priceB = parseFloat(b.querySelector('.descr-wrap__price').textContent.replace('$', ''));
    console.log(priceA);
    console.log(priceB);

    if (sortType === 'actual') {
      if (priceA === priceB) {
        return 0;
      } else if (priceA < priceB) {
        return -1;
      } else {
        return 1;
      }
    }

    if (sortType === 'low-to-high') {
      return priceA - priceB;
    }

    if (sortType === 'high-to-low') {
      return priceB - priceA;
    }
  });

  listItems.forEach(item => cardList.appendChild(item));
}

sortTypeSelect.addEventListener('change', SortCardList);

SortCardList();
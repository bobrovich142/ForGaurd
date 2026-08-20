document.addEventListener("DOMContentLoaded", () => {
    
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('cardsModal');

    // Проверяем, нашел ли браузер кнопку открытия
    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        modal.classList.add('active');
      });
    } else {
      console.error("Ошибка: Кнопка 'openModalBtn' или окно 'cardsModal' не найдены в HTML!");
    }

    // Проверяем и вешаем событие на крестик
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    // Закрытие при клике на темный фон вокруг окна
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
  });

  // Функция выбора карточки (оставляем снаружи)
  function selectCard(cardElement, cardName) {
    document.querySelectorAll('.selectable-card').forEach(el => {
      el.classList.remove('selected');
    });
    cardElement.classList.add('selected');
    console.log("Выбрана:", cardName);
  }
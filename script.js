function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
    }
}

function closeAuthModal(event) {
    if (event.target.classList.contains('auth-overlay')) {
        toggleAuthModal();
    }
}

function handleAuth(event) {
    event.preventDefault();

const loginValue = document.getElementById('authLogin').value;

document.querySelector('.account-trigger').innerHTML = `<span class="user-icon">🟢</sapn> ${loginValue}`;


toggleAuthModal();
alert(`Добро Пожаловать в Forgaurd, ${loginValue}!`);
}


function startPayment(tariffName) {
  const nicknameInput = document.getElementById('playerNickname');
  const username = nicknameInput ? nicknameInput.value.trim() : "";

  if (!username) {
    alert("Ошибка: Пожалуйста, введите ваш ник, чтобы мы знали, кому выдать статус!");
    return;
  }

  // Делаем фоновый запрос к нашему Python-серверу
  fetch('http://duckdns.org', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, tariff: tariffName })
  })
  .then(response => response.json())
  .then(data => {
    if (data.payment_url) {
      // Открываем РЕАЛЬНУЮ платежную ссылку, которую сгенерировал Python
      window.open(data.payment_url, '_blank');
    } else {
      alert("Ошибка платежной системы: " + data.error);
    }
  })
  .catch(err => {
    console.error(err);
    alert("Не удалось связаться с центральным Python-сервером.");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Блокируем скролл сайта
  document.body.classList.add('preloader-active');

  const preloader = document.getElementById('video-preloader');
  const video = document.getElementById('preloader-video');
  const music = document.getElementById('bg-mall-music');
  const skipBtn = document.getElementById('skip-preloader-btn');

  let isDestroyed = false;

  // ========================================================
  // ТВОЙ ПЛЕЙЛИСТ: Добавь сюда пути к своим аудиофайлам
  // ========================================================
  const playlist = [
    'media/dea.mp3',
    'media/Aphex.mp3',
    'media/buckshot.mp3',
    'media/buckshot_rou.mp3'
  ];

  let currentTrackIndex = 0;

  // Функция для выбора случайного стартового трека
  function shufflePlaylist() {
    if (playlist.length === 0) return;
    // Выбираем случайный начальный трек
    currentTrackIndex = Math.floor(Math.random() * playlist.length);
    loadTrack(currentTrackIndex);
  }

  // Функция загрузки трека в плеер
  function loadTrack(index) {
    if (!music || playlist.length === 0) return;
    music.src = playlist[index];
    music.volume = 0.3; // Комфортная громкость 30%
    music.load(); // Перезагружаем плеер для нового файла
    console.log(`Загружен трек №${index + 1}: ${playlist[index]}`);
  }

  // Функция включения следующего трека по порядку
  function playNextTrack() {
    if (playlist.length === 0) return;
    
    // Переходим к следующему индексу. Если дошли до конца — возвращаемся к первому (0)
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    
    loadTrack(currentTrackIndex);
    
    // Запускаем воспроизведение
    music.play().catch(error => {
      console.log("Автозапуск следующего трека не удался:", error);
    });
    
    console.log("Включился следующий трек из списка.");
  }

  // Инициализируем музыку (выбираем случайный трек для старта)
  shufflePlaylist();

  // ГЛАВНОЕ ОБНОВЛЕНИЕ: Слушаем, когда музыка закончится
  if (music) {
    // Убираем атрибут loop в JS, чтобы трек МОГ закончиться
    music.loop = false; 

    // Как только песня доиграла, запускаем функцию playNextTrack
    music.addEventListener('ended', playNextTrack);
  }

  // Функция запуска музыки после видео
  function startMallMusic() {
    if (!music || !music.src) return;
    
    music.play().catch(() => {
      // Если защита браузера заблокировала старт, ждем первого клика по сайту
      document.addEventListener('click', () => { music.play(); }, { once: true });
    });
  }

  // Функция закрытия видео-заставки
  function removePreloader() {
    if (isDestroyed) return;
    isDestroyed = true;

    if (preloader) {
      preloader.style.opacity = '0';
      startMallMusic(); // Запуск первой песни

      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.remove('preloader-active');
        preloader.remove();
      }, 600);
    }
  }

  // Кнопка "Пропустить"
  setTimeout(() => {
    if (skipBtn && !isDestroyed) skipBtn.style.opacity = '1';
  }, 1500);

  if (skipBtn) {
    skipBtn.addEventListener('click', removePreloader);
  }

  // Отслеживание конца видео
  if (video) {
    video.loop = false;
    video.addEventListener('ended', removePreloader);

    video.addEventListener('loadedmetadata', function() {
      const videoDurationWithBuffer = (video.duration * 1000) + 3000;
      setTimeout(() => {
        if (!isDestroyed) removePreloader();
      }, videoDurationWithBuffer);
    });
  } else {
    removePreloader();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const screensaver = document.getElementById('afk-screensaver');
  const ssVideo = document.getElementById('screensaver-video');
  
  let afkTimer;
  const afkTimeoutDuration = 10000; // 10 секунд ожидания (10000 миллисекунд)
  let isScreensaverActive = false;

  // Функция, которая ВКЛЮЧАЕТ видео при АФК
  function showScreensaver() {
    if (isScreensaverActive) return;
    isScreensaverActive = true;

    if (screensaver && ssVideo) {
      screensaver.style.display = 'flex';
      
      // Небольшая задержка, чтобы сработал CSS-переход opacity
      setTimeout(() => {
        screensaver.style.opacity = '1';
        ssVideo.play().catch(err => console.log("Браузер заблокировал запуск видео:", err));
      }, 50);
      
      console.log("Пользователь ушел в АФК. Включен скринсейвер.");
    }
  }

  // Функция, которая ВЫКЛЮЧАЕТ видео при движении
  function hideScreensaver() {
    if (!isScreensaverActive) return;
    isScreensaverActive = false;

    if (screensaver && ssVideo) {
      screensaver.style.opacity = '0';
      
      // Ждем окончания плавной анимации скрытия (400мс)
      setTimeout(() => {
        ssVideo.pause();
        ssVideo.currentTime = 0; // Сбрасываем видео на начало
        screensaver.style.display = 'none';
      }, 400);
      
      console.log("Пользователь вернулся. Скринсейвер отключен.");
    }
  }

  // Функция сброса таймера при любом действии
  function resetAfkTimer() {
    // Если заставка уже горит — убираем её
    hideScreensaver(); 

    // Очищаем старый таймер и запускаем отсчет 10 секунд заново
    clearTimeout(afkTimer);
    afkTimer = setTimeout(showScreensaver, afkTimeoutDuration);
  }

  // Список событий, которые считаются активностью пользователя
  const activityEvents = [
    'mousemove',   // Движение мыши
    'mousedown',   // Клик мыши
    'keydown',     // Нажатие клавиши на клавиатуре
    'touchstart',  // Касание экрана на телефоне
    'scroll'       // Прокрутка страницы
  ];

  // Вешаем слушатели событий на всё окно браузера
  activityEvents.forEach(eventType => {
    window.addEventListener(eventType, resetAfkTimer, { passive: true });
  });

  // Запускаем первичный отсчет при загрузке сайта
  afkTimer = setTimeout(showScreensaver, afkTimeoutDuration);
});
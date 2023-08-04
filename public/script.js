document.addEventListener('DOMContentLoaded', async () => {
  // Функция для загрузки данных о командах и игроках
  async function loadTeamsAndPlayers() {
    const response = await fetch('/teams');

    if (response.ok) {
      const teams = await response.json();
      displayTeams(teams);
      populateTeamSelects(teams);
    } else {
      console.error('Error fetching teams data');
    }
  }
  
  function displayTeams(teams) {
    const teamList = document.getElementById('teamList');
    teamList.innerHTML = ''; // Очищаем содержимое списка
  
    teams.forEach(team => {
      const listItem = document.createElement('li');
      listItem.textContent = team.name;
      teamList.appendChild(listItem);
    });
  }
  
  function displayPlayers(players) {
    const roster1 = document.getElementById('roster1');
    const roster2 = document.getElementById('roster2');
    roster1.innerHTML = ''; // Очищаем содержимое списка
    roster2.innerHTML = ''; // Очищаем содержимое списка
  
    players.forEach(player => {
      const listItem = document.createElement('li');
      listItem.textContent = player.name;
  
      if (player.team_id === parseInt(teamSelect1.value)) {
        roster1.appendChild(listItem);
      } else if (player.team_id === parseInt(teamSelect2.value)) {
        roster2.appendChild(listItem);
      }
    });
  }
  
  // Функция для заполнения выпадающих списков командами
  function populateTeamSelects(teams) {
    const teamSelect1 = document.getElementById('teamSelect1');
    const teamSelect2 = document.getElementById('teamSelect2');

    teams.forEach(team => {
      const option = document.createElement('option');
      option.value = team.id; // Предполагается, что у команды есть уникальный идентификатор (id) в базе данных
      option.textContent = team.name;

      // Добавляем опции в оба выпадающих списка
      teamSelect1.appendChild(option.cloneNode(true));
      teamSelect2.appendChild(option);
    });

    // Добавляем обработчики событий для изменения выбранных команд
    teamSelect1.addEventListener('change', handleTeamSelectChange);
    teamSelect2.addEventListener('change', handleTeamSelectChange);
  }

  // Обработчик события изменения выбранной команды
  async function handleTeamSelectChange(event) {
    // Получаем идентификатор выбранной команды
    const teamId = event.target.value;
  
    // Загружаем данные об игроках выбранной команды с сервера
    const response = await fetch(`/team/${teamId}/players`);
  
    if (response.ok) {
      const players = await response.json();
      if (event.target.id === 'teamSelect1') {
        displayPlayers(players, 'roster1'); // Отображаем данные об игроках на странице для команды 1
      } else if (event.target.id === 'teamSelect2') {
        displayPlayers(players, 'roster2'); // Отображаем данные об игроках на странице для команды 2
      }
    } else {
      console.error('Error fetching players data');
    }
  }
  
  function displayPlayers(players, listId) {
    const rosterList = document.getElementById(listId);
    rosterList.innerHTML = ''; // Очищаем содержимое списка
  
    players.forEach(player => {
      const listItem = document.createElement('li');
      listItem.textContent = `${player.name} (Number: ${player.number})`;
      rosterList.appendChild(listItem);
    });
  }
  
  // Обработчик события отправки формы
  async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const time = formData.get('time');
    const date = formData.get('date');
    const venue = formData.get('venue');
    const team1Id = formData.get('teamSelect1');
    const team2Id = formData.get('teamSelect2');

    // Отправляем данные на сервер (можно использовать fetch)
    const response = await fetch('/save-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ time, date, venue, team1Id, team2Id }),
    });

    if (response.ok) {
      // Если данные успешно отправлены на сервер, переходим на вторую страницу
      window.location.href = '/game.html';
    } else {
      console.error('Error saving game data');
    }
  }

  // Добавляем обработчик события отправки формы
  const form = document.getElementById('gameForm');
  form.addEventListener('submit', handleFormSubmit);

  // Загружаем данные о командах и игроках при загрузке страницы
  await loadTeamsAndPlayers();
});
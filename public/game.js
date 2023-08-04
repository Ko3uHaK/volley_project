document.addEventListener('DOMContentLoaded', () => {
  const players = document.querySelectorAll('.player');
  let selectedPlayer = null;

  players.forEach(player => {
    player.addEventListener('click', () => {
      if (!selectedPlayer) {
        // Если игрок не выбран, выбираем его для замены
        selectedPlayer = player;
        player.classList.add('selected');
      } else {
        // Если игрок уже выбран, то заменяем его и снимаем выделение
        selectedPlayer.classList.remove('selected');
        player.parentNode.replaceChild(selectedPlayer.cloneNode(true), player);
        selectedPlayer = null;
      }
    });
  });
});

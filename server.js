const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const pool = new Pool({
  user: 'user1',
  host: 'localhost',
  database: 'volleyball_db',
  password: '252525',
  port: 5432,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Добавляем middleware для обработки данных в формате JSON

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Обработчик для запросов на получение списка команд
app.get('/teams', async (req, res) => {
  try {
    const teamsQuery = 'SELECT * FROM teams';
    const teamsResult = await pool.query(teamsQuery);
    const teams = teamsResult.rows;
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обработчик для запросов на получение списка игроков для команды
app.get('/team/:teamId/players', async (req, res) => {
  const teamId = req.params.teamId;
  try {
    const playersQuery = 'SELECT * FROM players WHERE team_id = $1';
    const playersResult = await pool.query(playersQuery, [teamId]);
    const players = playersResult.rows;
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обработчик для запросов на сохранение данных игры
app.post('/save-game', async (req, res) => {
  const { time, date, venue, team1Id, team2Id } = req.body;
  try {
    // Здесь вы можете сохранить данные игры в базу данных
    // Или выполнить другую логику, связанную с сохранением игры
    // Например, можно создать отдельную таблицу для хранения данных игр
    // Или использовать существующие таблицы для сохранения данных игр

    // В этом примере просто возвращаем успешный ответ
    res.status(200).json({ message: 'Game data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Сервер запущен на порту http://localhost:3000');
});
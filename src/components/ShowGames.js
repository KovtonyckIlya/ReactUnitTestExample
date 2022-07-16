import React from 'react';
import styles from 'styles/ShowGames.css';

export default function showGames({games, joinGame}) {
  return (
    <div className={styles.box}>
      <div className={styles.roomName}>{games.roomName}</div>
      <div className={styles.id}>
        Game ID: {games._id}
        </div>
      <div className={styles.line}/>
      {games.players.map(player => {
        return (
          <div key={player.move}>
            <div className={styles.li}>
              Player:
              <div className={styles.value}>
                {player.move}
              </div>
            </div>
            <div className={styles.li}>
              name:
              <div className={styles.value}>
              {player.username}
              </div>
            </div>
            <div className={styles.line}/>
          </div>
        );
      })}
      <div 
        className={games.players.length > 1 ? [styles.button, styles.disabled].join(' ') : styles.button}
        onClick={() => joinGame(games._id, games.players.length)}
        >
        {games.players.length > 1 ? 'Game full' : 'Join game'}
      </div>
    </div>
  );
};
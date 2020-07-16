/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useState } from 'react';
import { remote } from 'electron';
import { useAudio } from 'react-use';
// import useSound from 'use-sound';
// @ts-ignore
import useInterval from 'react-useinterval';
import styles from './Home.css';
// @ts-ignore
import ergoicon from '../img/ergo.png';
import Eyeball, { Ball } from './Eyeball';

declare let global: any;

export default function Home() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  const [count, setCount] = useState(0);

  const [breakInterval, setBreakInterval] = useState(1);

  const [countDown, setCountDown] = useState(breakInterval * 60);

  const [xx, setXX] = useState(window.innerWidth / 2);
  const [yy, setYY] = useState(window.innerHeight / 2);

  const [showBalls, setShowBalls] = useState(false);

  // const [play, { stop, isPlaying }] = useSound('./assets/meditate.mp3');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audio, state, controls, ref] = useAudio({
    src: './assets/meditate.mp3',
    autoPlay: false
  });

  const increaseCount = (amount = 1) => {
    setCount(count + amount);
    if (countDown !== 0) {
      setCountDown(countDown - 1);
    } else {
      setCountDown(breakInterval * 60);
    }
    if (count % (breakInterval * 60) === 0) {
      const mainWindow = remote.getCurrentWindow();
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      if (!isFirstLaunch) {
        controls.pause();
        if (!showBalls) {
          setShowBalls(true);
        } else {
          alert('break time. lets meditate');
          controls.play();
        }
      } else {
        setIsFirstLaunch(false);
      }
    }
  };

  useInterval(increaseCount, 1000, 1);

  function myChangeHandler(evt: any) {
    setBreakInterval(evt.target.value);
    let oldVal = 60 - countDown;
    let interV = evt.target.value * 60;
    setCountDown(interV - oldVal);
  }

  return (
    <div>
      {audio}
      <div
        className={styles.min}
        onClick={() => {
          const mainWindow = remote.getCurrentWindow();
          mainWindow.minimize();
        }}
      >
        -
      </div>

      {!showBalls && (
        <div className={styles.container}>
          <h2>Ergo</h2>
          <img src={ergoicon} alt="ergo" />
        </div>
      )}
      {showBalls && (
        <div>
          <div
            className={styles.x}
            onClick={() => {
              setShowBalls(false);
              controls.pause();
            }}
          >
            X
          </div>
          <Eyeball duration={2000} start={yy - 50} end={50}>
            {value => <Ball y={value} />}
          </Eyeball>
        </div>
      )}
      {!showBalls && (
        <form className={styles.container} data-tid="container">
          <br />
          <br />
          <span>seconds until next break</span>
          <h1>{countDown}</h1>
          <br />
          <br />
          {/* <div>elapsed time {count}</div> */}
          <br />
          <button
            onClick={() => {
              controls.play();
            }}
          >
            play
          </button>
          <button
            onClick={() => {
              controls.pause();
            }}
          >
            stop
          </button>
          <button
            onClick={() => {
              setXX(window.innerWidth / 2);
              setYY(window.innerHeight / 2);
            }}
          >
            reset ball
          </button>
          <br />
          <br />
          <hr />
          <br />
          <span>Breaks every:</span>
          <input
            defaultValue={breakInterval}
            type="text"
            onChange={myChangeHandler}
          />
          <span> mins</span>
        </form>
      )}
    </div>
  );
}

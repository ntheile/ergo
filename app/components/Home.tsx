import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';
import ergoicon from '../assets/ergo.png';

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <h2>Ergo</h2>
      <img src={ergoicon} alt="ergo"/>
    </div>
  );
}

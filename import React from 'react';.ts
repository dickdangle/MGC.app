import React from 'react';
import Dashboard from './components/Dashboard';
import BountyBoard from './components/BountyBoard';
import Leaderboard from './components/Leaderboard';
import './styles.css';

const App = () => {
    return (
        <div>
            <header>
                <h1>Welcome to Project Zooter</h1>
                <nav>
                    <ul>
                        <li><a href="#dashboard">Dashboard</a></li>
                        <li><a href="#bounty-board">Bounty Board</a></li>
                        <li><a href="#leaderboard">Leaderboard</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <section id="dashboard">
                    <Dashboard />
                </section>
                <section id="bounty-board">
                    <BountyBoard />
                </section>
                <section id="leaderboard">
                    <Leaderboard />
                </section>
            </main>
        </div>
    );
};

export default App;
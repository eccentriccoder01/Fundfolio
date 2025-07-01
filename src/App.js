import React from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import Budget from './components/Budget';
import ExpenseTotal from './components/ExpenseTotal';
import ExpenseList from './components/ExpenseList';
import AllocationForm from './components/AllocationForm';
import RemainingBudget from './components/Remaining';
import Currency from './components/Currency';
import F from './FundFolioLogo.png';

const App = () => {
    return (
        <AppProvider>
            <div className='app-container'>
                <div className='main-content'>
                    <header className='header'>
                        <div className='header-content'>
                            <h1 className='app-title'>💰 
                                <img
                                    src={F}
                                    alt="F"
                                    style={{
                                        height: '4.3rem',
                                        transform: 'translateY(5px)'
                                    }}
                                />
                            undfolio</h1>
                            <p className='app-subtitle'>Smart Budget Allocation & Financial Management</p>
                        </div>
                    </header>
                    
                    <div className='dashboard-grid'>
                        <Budget />
                        <RemainingBudget />
                        <ExpenseTotal />
                        <Currency />
                    </div>
                    
                    <div className='content-section'>
                        <div className='section-header'>
                            <h2 className='section-title'>
                                <div className='section-icon'>📊</div>
                                Department Allocations
                            </h2>
                        </div>
                        <ExpenseList />
                    </div>
                    
                    <div className='content-section'>
                        <div className='section-header'>
                            <h2 className='section-title'>
                                <div className='section-icon'>⚙️</div>
                                Manage Allocations
                            </h2>
                        </div>
                        <AllocationForm />
                    </div>
                </div>
            </div>
        </AppProvider>
    );
};

export default App;
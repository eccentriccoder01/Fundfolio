import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const Budget = () => {
    const { budget, totalExpenses, currency, dispatch, utilizationPercentage } = useContext(AppContext);
    const [newBudget, setNewBudget] = useState(budget);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setNewBudget(budget);
    }, [budget]);

    const handleBudgetChange = (event) => {
        const inputValue = parseInt(event.target.value, 10);
        
        if (isNaN(inputValue) || inputValue < 0) {
            return;
        }
        
        if (inputValue > 100000) {
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: { message: "Budget cannot exceed £100,000!", type: 'error' }
            });
            return;
        }
        
        if (inputValue < totalExpenses) {
            dispatch({
                type: 'ADD_NOTIFICATION', 
                payload: { message: "Budget cannot be less than total allocated expenses!", type: 'error' }
            });
            return;
        }
        
        setNewBudget(inputValue);
    };

    const updateBudget = () => {
        if (newBudget !== budget) {
            dispatch({
                type: 'SET_BUDGET',
                payload: newBudget
            });
        }
        setIsEditing(false);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            updateBudget();
        }
        if (event.key === 'Escape') {
            setNewBudget(budget);
            setIsEditing(false);
        }
    };

    return (
        <div className='stats-card budget'>
            <div className='card-header'>
                <div className='card-title'>Total Budget</div>
                <div className='card-icon' style={{background: 'linear-gradient(to right, #BF953F, #FCF6BA, #FBF5B7, #AA771C)'}}>
                    💰
                </div>
            </div>
            
            <div className='card-value'>
                {isEditing ? (
                    <div className='budget-input-container'>
                        <span className='currency-symbol'>{currency}</span>
                        <input
                            type="number"
                            className='budget-input'
                            value={newBudget}
                            onChange={handleBudgetChange}
                            onBlur={updateBudget}
                            onKeyDown={handleKeyPress}
                            autoFocus
                            min="0"
                            max="100000"
                            step="100"
                        />
                    </div>
                ) : (
                    <div 
                        className='budget-display'
                        onClick={() => setIsEditing(true)}
                        style={{cursor: 'pointer'}}
                    >
                        {currency}{budget.toLocaleString()}
                    </div>
                )}
            </div>
            
            <div className='card-description'>
                Click to edit • {utilizationPercentage}% utilized
            </div>
            
            <div className='progress-bar'>
                <div 
                    className={`progress-fill ${utilizationPercentage >= 100 ? 'danger' : ''}`}
                    style={{width: `${Math.min(utilizationPercentage, 100)}%`}}
                ></div>
            </div>
        </div>
    );
};

export default Budget;
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ExpenseTotal = () => {
    const { totalExpenses, currency, budget, expenses } = useContext(AppContext);
    
    const getTopDepartment = () => {
        if (expenses.length === 0) return null;
        return expenses.reduce((max, expense) => 
            expense.cost > max.cost ? expense : max
        );
    };
    
    const topDepartment = getTopDepartment();
    const percentageOfBudget = budget > 0 ? Math.round((totalExpenses / budget) * 100) : 0;

    return (
        <div className='stats-card spent'>
            <div className='card-header'>
                <div className='card-title'>Total Allocated</div>
                <div className='card-icon' style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                    📊
                </div>
            </div>
            
            <div className='card-value'>
                {currency}{totalExpenses.toLocaleString()}
            </div>
            
            <div className='card-description'>
                {percentageOfBudget}% of budget • 
                {topDepartment && (
                    <span> Top: {topDepartment.name}</span>
                )}
            </div>
            
            <div className='progress-bar'>
                <div 
                    className={`progress-fill ${percentageOfBudget >= 100 ? 'danger' : ''}`}
                    style={{width: `${Math.min(percentageOfBudget, 100)}%`}}
                ></div>
            </div>
        </div>
    );
};

export default ExpenseTotal;
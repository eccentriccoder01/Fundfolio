import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const ExpenseItem = (props) => {
    const { dispatch, currency, remaining } = useContext(AppContext);
    const [customAmount, setCustomAmount] = useState(100);
    const [showCustomInput, setShowCustomInput] = useState(false);

    const handleDeleteExpense = () => {
        if (window.confirm(`Are you sure you want to reset the allocation for ${props.name}?`)) {
            dispatch({
                type: 'DELETE_EXPENSE',
                payload: props.name,
            });
        }
    };

    const increaseAllocation = (amount = 10) => {
        if (amount > remaining) {
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: { 
                    message: `Cannot add ${currency}${amount}. Only ${currency}${remaining} remaining!`, 
                    type: 'error' 
                }
            });
            return;
        }

        const expense = {
            name: props.name,
            cost: amount,
        };

        dispatch({
            type: 'ADD_EXPENSE',
            payload: expense
        });
    };

    const decreaseAllocation = (amount = 10) => {
        const expense = {
            name: props.name,
            cost: amount,
        };

        dispatch({
            type: 'RED_EXPENSE',
            payload: expense
        });
    };

    const handleCustomAmount = () => {
        if (customAmount > 0) {
            increaseAllocation(customAmount);
            setShowCustomInput(false);
            setCustomAmount(100);
        }
    };

    const getPercentageOfTotal = () => {
        // This would need total expenses from context
        return 0; // Placeholder
    };

    return (
        <tr>
            <td>
                <div className='department-name'>
                    <div 
                        className='department-icon'
                        style={{background: props.color || '#6b7280'}}
                    >
                        {props.icon || '🏢'}
                    </div>
                    <div>
                        <div style={{fontWeight: '600', color: 'var(--text-primary)'}}>
                            {props.name}
                        </div>
                        <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>
                            {props.cost > 0 ? 'Active allocation' : 'No allocation'}
                        </div>
                    </div>
                </div>
            </td>
            
            <td>
                <div className='allocation-amount'>
                    {props.currency}{props.cost.toLocaleString()}
                </div>
                {props.cost > 0 && (
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.25rem'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '4px',
                            background: 'var(--border-color)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <div 
                                style={{
                                    width: `${Math.min((props.cost / 5000) * 100, 100)}%`,
                                    height: '100%',
                                    background: props.color || 'var(--primary-color)',
                                    borderRadius: '2px'
                                }}
                            />
                        </div>
                    </div>
                )}
            </td>
            
            <td>
                <div className='action-buttons'>
                    <button 
                        className='action-btn increase'
                        onClick={() => increaseAllocation(10)}
                        title="Add £10"
                    >
                        +10
                    </button>
                    <button 
                        className='action-btn decrease'
                        onClick={() => decreaseAllocation(10)}
                        title="Reduce £10"
                        disabled={props.cost < 10}
                        style={{
                            opacity: props.cost < 10 ? 0.5 : 1,
                            cursor: props.cost < 10 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        -10
                    </button>
                </div>
            </td>
            
            <td>
                {showCustomInput ? (
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
                            className="form-input"
                            style={{width: '80px', padding: '0.25rem 0.5rem', fontSize: '0.75rem'}}
                            min="1"
                            max={remaining}
                        />
                        <button 
                            className='action-btn increase'
                            onClick={handleCustomAmount}
                            style={{fontSize: '0.75rem'}}
                        >
                            ✓
                        </button>
                        <button 
                            className='action-btn decrease'
                            onClick={() => setShowCustomInput(false)}
                            style={{fontSize: '0.75rem'}}
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <button 
                        className='action-btn'
                        onClick={() => setShowCustomInput(true)}
                        style={{
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem'
                        }}
                        title="Custom amount"
                    >
                        Custom
                    </button>
                )}
            </td>
            
            <td>
                <button 
                    className='action-btn delete'
                    onClick={handleDeleteExpense}
                    title={`Reset ${props.name} allocation`}
                >
                    🗑️
                </button>
            </td>
        </tr>
    );
};

export default ExpenseItem;
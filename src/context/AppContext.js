import React, { createContext, useReducer } from 'react';

// Initial state with enhanced data structure
const initialState = {
    budget: 10000,
    expenses: [
        { id: "Marketing", name: 'Marketing', cost: 2500, color: '#3b82f6', icon: '📢' },
        { id: "Finance", name: 'Finance', cost: 1800, color: '#10b981', icon: '💰' },
        { id: "Sales", name: 'Sales', cost: 3200, color: '#f59e0b', icon: '📈' },
        { id: "HR", name: 'HR', cost: 1200, color: '#8b5cf6', icon: '👥' },
        { id: "IT", name: 'IT', cost: 1500, color: '#ef4444', icon: '💻' },
        { id: "Admin", name: 'Admin', cost: 800, color: '#6b7280', icon: '🏢' },
    ],
    currency: '£',
    history: [],
    notifications: []
};

// Enhanced reducer with more actions and better state management
export const AppReducer = (state, action) => {
    const addToHistory = (actionType, department, amount) => {
        const historyEntry = {
            id: Date.now(),
            type: actionType,
            department,
            amount,
            timestamp: new Date().toISOString(),
            currency: state.currency
        };
        return [...state.history.slice(-49), historyEntry]; // Keep last 50 entries
    };

    const addNotification = (message, type = 'info') => {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toISOString()
        };
        return [...state.notifications.slice(-4), notification]; // Keep last 5 notifications
    };

    switch (action.type) {
        case 'ADD_EXPENSE':
            const totalBudget = state.expenses.reduce((prev, curr) => prev + curr.cost, 0);
            const newTotal = totalBudget + action.payload.cost;
            
            if (newTotal <= state.budget) {
                const updatedExpenses = state.expenses.map((expense) => {
                    if (expense.name === action.payload.name) {
                        return { ...expense, cost: expense.cost + action.payload.cost };
                    }
                    return expense;
                });
                
                return {
                    ...state,
                    expenses: updatedExpenses,
                    history: addToHistory('ADD', action.payload.name, action.payload.cost),
                    notifications: addNotification(
                        `Added ${state.currency}${action.payload.cost} to ${action.payload.name}`,
                        'success'
                    )
                };
            } else {
                return {
                    ...state,
                    notifications: addNotification(
                        `Cannot add ${state.currency}${action.payload.cost} to ${action.payload.name}. Insufficient funds!`,
                        'error'
                    )
                };
            }

        case 'RED_EXPENSE':
            const reducedExpenses = state.expenses.map((expense) => {
                if (expense.name === action.payload.name) {
                    const newCost = Math.max(0, expense.cost - action.payload.cost);
                    return { ...expense, cost: newCost };
                }
                return expense;
            });
            
            return {
                ...state,
                expenses: reducedExpenses,
                history: addToHistory('REDUCE', action.payload.name, action.payload.cost),
                notifications: addNotification(
                    `Reduced ${state.currency}${action.payload.cost} from ${action.payload.name}`,
                    'warning'
                )
            };

        case 'DELETE_EXPENSE':
            const expenseToDelete = state.expenses.find(exp => exp.name === action.payload);
            const resetExpenses = state.expenses.map((expense) => {
                if (expense.name === action.payload) {
                    return { ...expense, cost: 0 };
                }
                return expense;
            });
            
            return {
                ...state,
                expenses: resetExpenses,
                history: addToHistory('RESET', action.payload, expenseToDelete?.cost || 0),
                notifications: addNotification(
                    `Reset allocation for ${action.payload}`,
                    'info'
                )
            };

        case 'SET_BUDGET':
            const oldBudget = state.budget;
            return {
                ...state,
                budget: action.payload,
                history: addToHistory('BUDGET_CHANGE', 'Budget', action.payload - oldBudget),
                notifications: addNotification(
                    `Budget updated to ${state.currency}${action.payload}`,
                    'info'
                )
            };

        case 'CHG_CURRENCY':
            return {
                ...state,
                currency: action.payload,
                notifications: addNotification(
                    `Currency changed to ${action.payload}`,
                    'info'
                )
            };

        case 'ADD_DEPARTMENT':
            const newDepartment = {
                id: action.payload.name,
                name: action.payload.name,
                cost: 0,
                color: action.payload.color || '#6b7280',
                icon: action.payload.icon || '🏢'
            };
            
            return {
                ...state,
                expenses: [...state.expenses, newDepartment],
                notifications: addNotification(
                    `Added new department: ${action.payload.name}`,
                    'success'
                )
            };

        case 'REMOVE_DEPARTMENT':
            const filteredExpenses = state.expenses.filter(exp => exp.name !== action.payload);
            const removedDept = state.expenses.find(exp => exp.name === action.payload);
            
            return {
                ...state,
                expenses: filteredExpenses,
                history: addToHistory('REMOVE_DEPT', action.payload, removedDept?.cost || 0),
                notifications: addNotification(
                    `Removed department: ${action.payload}`,
                    'warning'
                )
            };

        case 'CLEAR_NOTIFICATIONS':
            return {
                ...state,
                notifications: []
            };

        case 'CLEAR_HISTORY':
            return {
                ...state,
                history: []
            };

        case 'BULK_UPDATE':
            return {
                ...state,
                expenses: action.payload.expenses || state.expenses,
                budget: action.payload.budget || state.budget,
                notifications: addNotification(
                    'Bulk update completed',
                    'success'
                )
            };

        default:
            return state;
    }
};

export const AppContext = createContext();

export const AppProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    
    // Calculate remaining budget
    const totalExpenses = state.expenses.reduce((total, item) => total + item.cost, 0);
    const remaining = state.budget - totalExpenses;
    
    // Calculate budget utilization percentage
    const utilizationPercentage = state.budget > 0 ? (totalExpenses / state.budget) * 100 : 0;
    
    // Get budget status
    const getBudgetStatus = () => {
        if (utilizationPercentage >= 100) return 'over';
        if (utilizationPercentage >= 90) return 'critical';
        if (utilizationPercentage >= 75) return 'warning';
        return 'healthy';
    };

    return (
        <AppContext.Provider
            value={{
                expenses: state.expenses,
                budget: state.budget,
                remaining: remaining,
                currency: state.currency,
                history: state.history,
                notifications: state.notifications,
                utilizationPercentage: Math.round(utilizationPercentage),
                budgetStatus: getBudgetStatus(),
                totalExpenses: totalExpenses,
                dispatch
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};
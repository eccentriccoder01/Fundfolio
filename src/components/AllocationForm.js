import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const AllocationForm = () => {
  const { dispatch, remaining, currency, expenses } = useContext(AppContext);

  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [action, setAction] = useState("Add");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    { value: "Marketing", label: "Marketing", icon: "📢" },
    { value: "Sales", label: "Sales", icon: "📈" },
    { value: "Finance", label: "Finance", icon: "💰" },
    { value: "HR", label: "HR", icon: "👥" },
    { value: "IT", label: "IT", icon: "💻" },
    { value: "Admin", label: "Admin", icon: "🏢" },
  ];

  const validateForm = () => {
    if (!name) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: { message: "Please select a department", type: "error" },
      });
      return false;
    }

    if (!cost || cost <= 0) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: { message: "Please enter a valid amount", type: "error" },
      });
      return false;
    }

    const numericCost = parseInt(cost);

    if (action === "Add" && numericCost > remaining) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: `Cannot add ${currency}${numericCost}. Only ${currency}${remaining} remaining!`,
          type: "error",
        },
      });
      return false;
    }

    if (action === "Reduce") {
      const currentExpense = expenses.find((exp) => exp.name === name);
      if (currentExpense && numericCost > currentExpense.cost) {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            message: `Cannot reduce ${currency}${numericCost}. ${name} only has ${currency}${currentExpense.cost} allocated!`,
            type: "error",
          },
        });
        return false;
      }
    }

    return true;
  };

  const submitEvent = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const expense = {
      name: name,
      cost: parseInt(cost),
    };

    try {
      if (action === "Reduce") {
        dispatch({
          type: "RED_EXPENSE",
          payload: expense,
        });
      } else {
        dispatch({
          type: "ADD_EXPENSE",
          payload: expense,
        });
      }

      // Reset form on successful submission
      setName("");
      setCost("");
      setAction("Add");
    } catch (error) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: "An error occurred while processing your request",
          type: "error",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitEvent();
    }
  };

  const selectedDepartment = departments.find((dept) => dept.value === name);
  const currentAllocation =
    expenses.find((exp) => exp.name === name)?.cost || 0;

  return (
    <div className="allocation-form">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="department-select">
            Department
          </label>
          <div style={{ position: "relative" }}>
            <select
              id="department-select"
              className="form-select"
              value={name}
              onChange={(event) => setName(event.target.value)}
              style={{ paddingLeft: selectedDepartment ? "2.5rem" : "1rem" }}
            >
              <option value="">Choose department...</option>
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
            {selectedDepartment && (
              <div
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  fontSize: "0.875rem",
                }}
              >
                {selectedDepartment.icon}
              </div>
            )}
          </div>
          <div className="form-helper-text">
            {name
              ? `Current allocation: ${currency}${currentAllocation.toLocaleString()}`
              : ""}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="action-select">
            Action
          </label>
          <select
            id="action-select"
            className="form-select"
            value={action}
            onChange={(event) => setAction(event.target.value)}
          >
            <option value="Add">💰 Add Funds</option>
            <option value="Reduce">📉 Reduce Funds</option>
          </select>
          <div className="form-helper-text">
            {/* Empty space for alignment */}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="amount-input">
            Amount
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="amount-input"
              type="number"
              className="form-input"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter amount"
              min="1"
              max={action === "Add" ? remaining : currentAllocation}
              step="10"
              style={{ paddingLeft: "2.5rem" }}
            />
            <div
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                fontWeight: "600",
                pointerEvents: "none",
              }}
            >
              {currency}
            </div>
          </div>
          <div className="form-helper-text">
            {action === "Add"
              ? `Available: ${currency}${remaining.toLocaleString()}`
              : ""}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ visibility: "hidden" }}>
            Action
          </label>
          <button
            className="primary-btn"
            onClick={submitEvent}
            disabled={isSubmitting || !name || !cost}
          >
            {isSubmitting ? (
              <>
                <div
                  style={{
                    width: "1rem",
                    height: "1rem",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Processing...
              </>
            ) : (
              <>
                {action === "Add" ? "💰" : "📉"}
                {action === "Add" ? "Add Funds" : "Reduce Funds"}
              </>
            )}
          </button>
          <div className="form-helper-text">
            {/* Empty space for alignment */}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {name && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "var(--bg-secondary)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            Quick Actions for {selectedDepartment?.icon} {name}
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {[100, 250, 500, 1000].map((amount) => (
              <button
                key={amount}
                onClick={() => setCost(amount.toString())}
                style={{
                  padding: "0.5rem 0.75rem",
                  border: "1px solid var(--border-color)",
                  background:
                    cost === amount.toString()
                      ? "var(--primary-color)"
                      : "var(--bg-primary)",
                  color:
                    cost === amount.toString()
                      ? "white"
                      : "var(--text-primary)",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (cost !== amount.toString()) {
                    e.target.style.background = "var(--bg-secondary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (cost !== amount.toString()) {
                    e.target.style.background = "var(--bg-primary)";
                  }
                }}
              >
                {currency}
                {amount}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AllocationForm;

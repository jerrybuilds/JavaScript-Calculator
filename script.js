const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";
let resultShown = false;

function updateDisplay() {
    display.value = expression || "0";
}

function calculate() {
    if (!expression) return;

    try {
        if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        const result = Function('"use strict"; return (' + expression + ')')();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        expression = String(
            Math.round((result + Number.EPSILON) * 1e10) / 1e10
        );

        resultShown = true;
        updateDisplay();
    } catch {
        display.value = "Error";
        expression = "";
        resultShown = false;
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            expression = "";
            resultShown = false;
            updateDisplay();
            return;
        }

        if (action === "delete") {
            if (resultShown) {
                expression = "";
                resultShown = false;
            } else {
                expression = expression.slice(0, -1);
            }

            updateDisplay();
            return;
        }

        if (action === "calculate") {
            calculate();
            return;
        }

        if (action === "sign") {
            if (expression && Number.isFinite(Number(expression))) {
                expression = String(-Number(expression));
                resultShown = false;
                updateDisplay();
            }
            return;
        }

        if (value !== undefined) {
            if (resultShown) {
                if ("+-*/%".includes(value)) {
                    resultShown = false;
                } else {
                    expression = "";
                    resultShown = false;
                }
            }

            expression += value;
            updateDisplay();
        }
    });
});
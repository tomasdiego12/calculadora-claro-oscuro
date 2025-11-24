/**
 * ==============================================
 * PARTE 1: LÓGICA DE CÁLCULO Y CLASE CALCULATOR
 * ==============================================
 */

/**
 * Función que evalúa una expresión matemática de forma segura.
 * @param {string} expression - La expresión matemática a calcular.
 * @returns {(number|string)} - El resultado o la cadena 'Error'.
 */
function safeCalculate(expression) {
    // Caracteres permitidos: números, +, -, *, /, y .
    const forbiddenChars = /[^0-9+\-*/.]/g; 

    try {
        if (forbiddenChars.test(expression) || !expression) {
            return 'Error';
        }
        
        // Ejecución segura de la expresión
        const result = new Function('return ' + expression)();
        
        if (typeof result !== 'number' || !isFinite(result)) {
            return 'Error';
        }

        // Limita el resultado a 10 decimales
        return parseFloat(result.toFixed(10));

    } catch (error) {
        return 'Error';
    }
}

// Clase principal que maneja el estado y la lógica de la calculadora.
class Calculator {
    /**
     * @param {HTMLElement} displayElement - El elemento DOM para la pantalla.
     */
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.shouldReset = false; 
        this.clear();
    }

    /** Reinicia el estado a '0'. */
    clear() {
        this.currentExpression = '0';
        this.shouldReset = false;
        this.updateDisplay();
    }

    /** Actualiza el texto de la pantalla del DOM. */
    updateDisplay() {
        this.displayElement.innerText = this.currentExpression;
    }
    
    /** * Procesa la entrada de un botón. */
    append(value) {
        
        const operators = ['+', '-', '*', '/'];
        const isOperator = operators.includes(value);
        const isControl = ['C', '='].includes(value);
        const isNumberOrDecimal = !isOperator && !isControl;

        // 1. --- Manejo del Reset ---
        if (this.shouldReset) {
            this.shouldReset = false; 
            if (isNumberOrDecimal) {
                this.currentExpression = value;
                this.updateDisplay();
                return;
            } 
        }

        // 2. --- Lógica de reemplazo de '0' inicial y manejo de Error ---
        if ((this.currentExpression === '0' || this.currentExpression === 'Error') && isNumberOrDecimal && value !== '.') {
            this.currentExpression = value;
            this.updateDisplay();
            return;
        }

        // 3. --- Evitar doble punto decimal ---
        const lastNumber = this.currentExpression.split(/[\+\-\*\/]/).pop();
        if (value === '.' && lastNumber.includes('.')) {
            return; 
        }

        // 4. --- Evitar dobles operadores seguidos o reemplazar el último ---
        const lastChar = this.currentExpression.slice(-1);
        const lastCharIsOperator = operators.includes(lastChar);
        
        if (isOperator && lastCharIsOperator) {
            this.currentExpression = this.currentExpression.slice(0, -1) + value;
        } else {
            this.currentExpression += value;
        }
        
        this.updateDisplay();
    }

    /** Ejecuta el cálculo usando la expresión actual y muestra el resultado. */
    calculate() {
        const result = safeCalculate(this.currentExpression);
        
        if (result === 'Error') {
            this.currentExpression = 'Error';
        } else {
            this.currentExpression = String(result);
        }

        this.shouldReset = true; 
        this.updateDisplay();
    }
}


/**
 * ==============================================
 * PARTE 2: INICIALIZACIÓN Y EVENT LISTENERS
 * ==============================================
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DE LA CALCULADORA ---
    const displayElement = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');

    // Aseguramos que el display exista antes de crear la calculadora
    if (!displayElement) return; 

    const calculator = new Calculator(displayElement);

    // Asignar Event Listeners (Controlador Central de Botones)
    buttons.forEach(button => {
        // Ignorar el botón de tema en la lógica de cálculo
        if (button.id === 'theme-toggle') return; 

        button.addEventListener('click', () => {
            const value = button.dataset.value;

            // Dirigir el flujo a los métodos de la clase
            if (value === 'C') {
                calculator.clear();
            } else if (value === '=') {
                calculator.calculate();
            } else {
                calculator.append(value);
            }
        });
    });


    // --- LÓGICA DE CAMBIO DE TEMA ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            
            // Cambia el emoji del botón
            if (body.classList.contains('light-mode')) {
                themeToggle.innerText = '🌙'; // Luna para ir a Oscuro
            } else {
                themeToggle.innerText = '🌞'; // Sol para ir a Claro
            }
        });
    }
});
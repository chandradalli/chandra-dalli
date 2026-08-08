import { useEffect, useState } from 'react'

const operators = ['+', '-', '×', '÷', '^']
const functionButtons = ['sin', 'cos', 'tan', 'log', 'ln', '√', 'exp']
const buttonValueMap: Record<string, string> = {
  sin: 'sin(',
  cos: 'cos(',
  tan: 'tan(',
  log: 'log(',
  ln: 'ln(',
  '√': '√(',
  exp: 'exp(',
}

function App() {
  const [display, setDisplay] = useState('0')

  const appendValue = (value: string) => {
    if (display === 'Error') {
      setDisplay(value === '.' ? '0.' : value)
      return
    }

    if (display === '0' && value !== '.' && value !== '(' && value !== ')' && !Object.values(buttonValueMap).includes(value)) {
      setDisplay(value)
      return
    }

    const lastChar = display.slice(-1)
    if (operators.includes(lastChar) && operators.includes(value)) {
      setDisplay(display.slice(0, -1) + value)
      return
    }

    setDisplay(display + value)
  }

  const clearAll = () => setDisplay('0')

  const deleteLast = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0')
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyboard(event)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [display])

  const calculateResult = () => {
    try {
      const expression = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/π/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')

      const result = Function('"use strict"; return (' + expression + ')')()
      setDisplay(String(result))
    } catch {
      setDisplay('Error')
    }
  }

  const handleKeyboard = (event: KeyboardEvent) => {
    const { key } = event

    if (/^[0-9]$/.test(key) || key === '.') {
      appendValue(key)
      return
    }

    if (key === 'Enter' || key === '=') {
      event.preventDefault()
      calculateResult()
      return
    }

    if (key === 'Backspace') {
      deleteLast()
      return
    }

    if (key === 'Escape') {
      clearAll()
      return
    }

    if (['+', '-', '*', '/', '^', '(', ')'].includes(key)) {
      const operator = key === '*' ? '×' : key === '/' ? '÷' : key
      appendValue(operator)
    }
  }

  const buttons = [
    'sin', 'cos', 'tan', 'log', 'ln',
    '√', '^', 'exp', '(', ')',
    'π', 'e', '7', '8', '9',
    '4', '5', '6', '÷', '×',
    '1', '2', '3', '-', '+',
    '0', '.', '=', 'C', '⌫',
  ]

  return (
    <div className="calculator">
      <div className="calculator__screen" data-testid="display">
        {display}
      </div>

      <div className="calculator__buttons">
        {buttons.map((button) => {
          const isOperator = operators.includes(button) || button === '='
          const isFunction = functionButtons.includes(button)
          return (
            <button
              key={button}
              className={`calculator__button ${isOperator ? 'operator' : ''} ${isFunction ? 'function' : ''}`}
              onClick={() => {
                if (button === 'C') {
                  clearAll()
                } else if (button === '⌫') {
                  deleteLast()
                } else if (button === '=') {
                  calculateResult()
                } else {
                  appendValue(buttonValueMap[button] ?? button)
                }
              }}
            >
              {button}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default App

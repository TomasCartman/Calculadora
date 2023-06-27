const display = document.querySelector('.display')

const calculator = {
    displayArray: []
}

const isOperator = i => i === '%' || i === 'X' || i === '/' || i === '+' || i === '-' ? true : false
const isFunc = i => i === 'C' || i === 'AC' ? true : false
const emptyElementsAtEnd = (a, b) => a === undefined ? -1 : 0


/* Configuration */

function numberSetOnClick() {
    const inputNumber = document.querySelectorAll('.number')
    inputNumber.forEach( numKey => {
        numKey.onclick = () => {
            numberHandler(numKey.innerHTML)
        }
    })
}

function funcSetOnClick() {
    const inputFunction = document.querySelectorAll('.func')
    inputFunction.forEach( func => {
        func.onclick = () => {
            funcHandler(func.innerHTML)
        }
    })
}

function operationSetOnClick() {
    const inputOperation = document.querySelectorAll('.operation')
    inputOperation.forEach( op => {
        op.onclick = () => {
            operationHandler(op.innerHTML)
        }  
    })
}

function keySetOnPress() {
    document.onkeydown = event => {
        let key = event.key;
        if(!isNaN(key)) {
            numberHandler(key)
        } else if(isFunc(key)) {
            funcHandler(key)
        } else if(key === '/' || key === '*' || key === '-' || key === '+' || key === '=' || key === 'Enter') {
            if(key === '*') key = 'X'
            if(key === 'Enter') key = '='
            operationHandler(key)
        }
    }
}

/* View */

function funcHandler(type) {
    if(type === 'AC') resetCalculator()
    else displayThis('')
}

function resetCalculator() {
    calculator.displayArray = []
    displayThis('')
}

function displayThis(value) {
    display.innerHTML = `${value}`
}

function resetAndDisplay(value) {
    calculator.displayArray = [value]
    displayThis(value)
}

function updateDisplay() {
    const toBeDisplayed = calculator.displayArray.reduce((prev, curr) => prev.concat(curr), '')
    display.innerHTML = toBeDisplayed
}

/* Logic */

function numberHandler(num) {
    calculator.displayArray.push(num)
    updateDisplay()
}

function operationHandler(operation) {
    if(operation !== '=' && operation !== '%') {
        const lastIndex = calculator.displayArray.length-2
        if(isOperator(calculator.displayArray[lastIndex])) {
            calculator.displayArray[lastIndex] = operation
        } else {
            calculator.displayArray.push(' ')
            calculator.displayArray.push(operation)
            calculator.displayArray.push(' ')
        }
        updateDisplay()
    } else if(operation === '%') {
        const percentage = calculatePercentage()
        // this will takes some time
    } else {
        calculate()
    }
}

function calculate() {
    let stringArray = calculator.displayArray.toString()
    stringArray = stringArray.replaceAll(',', '')
    const arrayToCalculate = stringArray.split(' ')
    try {
        const result = calcRecursive(arrayToCalculate)
        if(isNaN(result)) {
            resetCalculator()
            displayThis('Error!')
        } else {
            resetAndDisplay(result)
        }
    } catch (error) {
        displayThis('Error!')   
    }
}

function calcRecursive(arr) {
    do {
        if(arr.includes('/') || arr.includes('X')) {
            calculateDivisionAndMultiplication(arr)
        } else if(arr.includes('+') || arr.includes('-')) {
            calculatePlusAndMinus(arr)
        }
    } while(arr.length > 1)
    return arr[0]
}

function calculateDivisionAndMultiplication(arr) {
    if (arr.includes('/')) {
        calculateDivision(arr)
    } else {
        calculateMultiplication(arr)
    }
}

function calculatePlusAndMinus(arr) {
    if (arr.includes('+')) {
        calculatePlus(arr)
    } else {
        calculateMinus(arr)
    }
}

function calculateDivision(arr) {
    let opPosition = arr.indexOf('/')
    if (opPosition) {
        const value = arr[opPosition-1] / arr[opPosition+1]
        arr[opPosition-1] = value
        removeEmptySpacesArray(arr, opPosition)
    }
}

function calculateMultiplication(arr) {
    let opPosition = arr.indexOf('X')
    if (opPosition) {
        const value = arr[opPosition-1] * arr[opPosition+1]
        arr[opPosition-1] = value
        removeEmptySpacesArray(arr, opPosition)
    }
}

function calculatePlus(arr) {
    let opPosition = arr.indexOf('+')
    if (opPosition) {
        const value = parseInt(arr[opPosition-1], 10) + parseInt(arr[opPosition+1], 10)
        arr[opPosition-1] = value
        removeEmptySpacesArray(arr, opPosition)
    }
}

function calculateMinus(arr) {
    let opPosition = arr.indexOf('-')
    if (opPosition) {
        const value = arr[opPosition-1] - arr[opPosition+1]
        arr[opPosition-1] = value
        removeEmptySpacesArray(arr, opPosition)
    }
}

function removeEmptySpacesArray(arr, opPosition) {
        delete arr[opPosition]
        delete arr[opPosition+1]
        arr = arr.sort(emptyElementsAtEnd)
        arr.pop()
        arr.pop()
}

function calculatePercentage() {

}


function main() {
    numberSetOnClick()
    funcSetOnClick()
    operationSetOnClick()
    keySetOnPress()
}

main()
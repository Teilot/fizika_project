
const inputX = document.getElementById('inputValueX');
const inputX2 = document.getElementById('inputValueX2');
const inputY = document.getElementById('inputValueY');
const ctx = document.getElementById('myChart');
const quadraticApprox = document.getElementById('quadratic-approx');
const linearApprox = document.getElementById('liner-approx');
const buttonClick = document.getElementById('button-click');
const buttonForInputValueX2 = document.getElementById('button-for-inputValueX2');
const addFunction = document.querySelector('.function');
const outputY2 = document.querySelector('.output-y2');
const labelInputValueX2 = document.querySelector('.input-valueX2');

// Функция для вычисления линейной аппроксимации (в данном случае просто прямой линии y = mx + c)
function linearApproximation(x, m, c) {
    return m * x + c;
}

function quadraticApproximation(x, a, b, c) {
    return a * x * x + b * x + c;
}

// Функция для вычисления аппроксимации методом наименьших квадратов
function leastSquaresApproximation(xValues, yValues, degree) {
    // Подготовка матрицы для решения уравнения методом наименьших квадратов
    let matrix = [];
    for (let i = 0; i < degree + 1; i++) {
        let row = [];
        for (let j = 0; j < degree + 1; j++) {
            let sum = 0;
            for (let k = 0; k < xValues.length; k++) {
                sum += Math.pow(xValues[k], i + j);
            }
            row.push(sum);
        }
        matrix.push(row);
    }

    // Подготовка вектора свободных членов
    let constants = [];
    for (let i = 0; i < degree + 1; i++) {
        let sum = 0;
        for (let j = 0; j < yValues.length; j++) {
            sum += yValues[j] * Math.pow(xValues[j], i);
        }
        constants.push(sum);
    }

    console.log(matrix);

    // Решение системы уравнений
    // Возвращаем коэффициенты аппроксимации
    return gaussianElimination(matrix, constants);
}

// Метод Гаусса для решения системы линейных уравнений
function gaussianElimination(matrix, constants) {
    let A = new MatrixLU(matrix)
    return A.solveLU(constants)
}


// Отображение графика с использованием библиотеки Chart.js
quadraticApprox.addEventListener('change', function () {
    let some_var = this.checked
});
linearApprox.addEventListener('change', function () {
    let some_var = this.checked
});

console.log(quadraticApprox.checked);

window.myChart = undefined;
let coefficients;
buttonClick.addEventListener("click", () => {

    try {

        const xValues = inputX.value.split(' ').map(x => parseFloat(x));
        const yValues = inputY.value.split(' ').map(x => parseFloat(x));

        const degree = quadraticApprox.checked ? 2 : 1;
        coefficients = leastSquaresApproximation(xValues, yValues, degree);

// Создание массива значений для построения линии аппроксимации
        const values = xValues.map(x => quadraticApprox.checked ? quadraticApproximation(x, coefficients[2], coefficients[1], coefficients[0]) : linearApproximation(x, coefficients[1], coefficients[0]));
        console.log(values)
        if (quadraticApprox.checked && !linearApprox.checked
            || !quadraticApprox.checked && linearApprox.checked) {

            // Проверяем, существует ли уже диаграмма с ID '0'
            if (window.myChart) {
                window.myChart.destroy(); // Если существует, уничтожаем её
            }

            window.myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: xValues.sort((a, b) => parseFloat(a) - parseFloat(b)),
                    datasets: [
                        {
                            type: 'scatter',
                            label: 'Функция y',
                            data: yValues,
                            borderColor: 'red',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)'
                        },
                        {
                            label: quadraticApprox.checked ? 'Квадратичная аппроксимация' : 'Линейная аппроксимация',
                            data: values.sort((a, b) => parseFloat(a) - parseFloat(b)),
                            fill: false,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'blue',
                        }

                    ]
                },
                options: {
                    parsing: {
                        xAxisKey: 'x',
                        yAxisKey: 'y'
                    },
                }
            });

        } else {
            alert("Выберите что-то одно");
        }
        addFunction.innerHTML = quadraticApprox.checked ? `<p>&#955 = ${coefficients[2].toFixed(4)}*&#966^2 ${coefficients[1] > 0 ? '+' + coefficients[1].toFixed(4) : coefficients[1].toFixed(4)}*&#966 ${coefficients[0] > 0 ? '+' + coefficients[0].toFixed(4) : coefficients[0].toFixed(4)}  </p>` :
            `<p>&#955 = ${coefficients[1].toFixed(4)}*&#966 ${coefficients[0] > 0 ? '+' + coefficients[0].toFixed(4) : coefficients[0].toFixed(4)}</p>`;
        ctx.style.background = '#fff';
        labelInputValueX2.style.display = 'block';
    } catch (ex) {
        alert("Не верный ввод!")
    }

});

// 35 42 113 123 252 388 441 466 472 560 581 702 750
// 404.6 407.7 435.8 439.8 491.6 546.0 567.5 576.9 579.0 615.2 623.4 671.6 690.7
// 48 108 238 664 29 52 119 141 202 253 277 285 491 693 740 56 91 174 265 550 701
buttonForInputValueX2.addEventListener('click', () => {


    const xValues2 = inputX2.value.split(' ');
    let values2 = xValues2.map(x => quadraticApprox.checked ? quadraticApproximation(x, coefficients[2], coefficients[1], coefficients[0]) : linearApproximation(x, coefficients[1], coefficients[0]));

    outputY2.innerHTML = `<p>&#955<sub>2</sub>: ${values2.map(function (each_element) {
        return Number(each_element.toFixed(1));
    })}</p>`

    if (window.myChart) {
        xValues2.sort((a, b) => parseFloat(a) - parseFloat(b));
        values2.sort((a, b) => parseFloat(a) - parseFloat(b))
        let newData = [];
        for (let i = 0; i < xValues2.length; i++) {
            newData[i] = {x: xValues2[i], y: values2[i]};
        }
        const newDataset = {
            label: 'Функция y2',
            type: 'scatter',
            data: newData,
            backgroundColor: 'rgb(31,253,23, 0.5)',
            borderColor: 'green',
            pointRadius: 5
        };
        window.myChart.data.datasets.push(newDataset);
        window.myChart.update(); // Обновляем график с новыми данными
    }
});

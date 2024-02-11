// Функция для решения СЛАУ с помощью LU-разложени
class MatrixLU {
    matrix = [];
    L = [];
    U = [];

    constructor(matrix) {
        this.matrix = matrix;
        this.luDecomposition(matrix)
    }

    // Функция для выполнения LU-разложения матрицы
    luDecomposition(matrix) {
        let n = matrix.length;

        for (let i = 0; i < n; i++) {
            // Инициализация матриц L и U
            this.L[i] = new Array(n).fill(0);
            this.U[i] = new Array(n).fill(0);
        }

        for (let j = 0; j < n; j++) {
            // Заполнение диагонали матрицы L единицами
            this.L[j][j] = 1;

            // Заполнение верхней части матрицы U
            for (let i = 0; i <= j; i++) {
                let sum = 0;
                for (let k = 0; k < i; k++) {
                    sum += this.L[i][k] * this.U[k][j];
                }
                this.U[i][j] = matrix[i][j] - sum;
            }

            // Заполнение нижней части матрицы L
            for (let i = j + 1; i < n; i++) {
                let sum = 0;
                for (let k = 0; k < j; k++) {
                    sum += this.L[i][k] * this.U[k][j];
                }
                this.L[i][j] = (matrix[i][j] - sum) / this.U[j][j];
            }
        }
    };

    // Функция для вычисления определителя матрицы
    determinant() {
        const n = this.L.length;
        let det = 1;

        for (let i = 0; i < n; i++) {
            det *= this.L[i][i] * this.U[i][i];
        }

        return det;
    }

    // Функция для вычисления обратной матрицы
    inverse() {
        const n = this.matrix.length;
        const identity = [];
        const inv = [];

        for (let i = 0; i < n; i++) {
            // Инициализация единичной матрицы
            identity[i] = new Array(n).fill(0);
            identity[i][i] = 1;

            // Инициализация обратной матрицы
            inv[i] = new Array(n);

            for (let j = 0; j < n; j++) {
                inv[i][j] = this.matrix[i][j];
            }
        }

        for (let i = 0; i < n; i++) {
            inv[i] = this.solveLU(identity[i]);
        }

        return inv;
    }

    solveLU(b) {
        const n = this.L.length;
        const y = new Array(n);
        const x = new Array(n);

        // Решение Ly = b
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < i; j++) {
                sum += this.L[i][j] * y[j];
            }
            y[i] = (b[i] - sum) / this.L[i][i];
        }

        // Решение Ux = y
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) {
                sum += this.U[i][j] * x[j];
            }
            x[i] = (y[i] - sum) / this.U[i][i];
        }

        return x;
    }
}


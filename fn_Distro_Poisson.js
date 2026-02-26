
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}


function poissonProbability(lambda, k, type = 'exact') {

    const calculateP_exact = (i) => {
        return (Math.pow(lambda, i) * Math.exp(-lambda)) / factorial(i);
    };

    let rawProbability = 0;

    switch (type) {
        case 'exact':
            rawProbability = calculateP_exact(k);
            break;

        case 'atMost':
            for (let i = 0; i <= k; i++) {
                rawProbability += calculateP_exact(i);
            }
            break;

        case 'lessThan':
            for (let i = 0; i < k; i++) {
                rawProbability += calculateP_exact(i);
            }
            break;

        case 'atLeast':
            let probLessThan = 0;
            for (let i = 0; i < k; i++) {
                probLessThan += calculateP_exact(i);
            }
            rawProbability = 1 - probLessThan;
            break;

        case 'moreThan':
            let probAtMost = 0;
            for (let i = 0; i <= k; i++) {
                probAtMost += calculateP_exact(i);
            }
            rawProbability = 1 - probAtMost;
            break;

        default:
            return "Error: Tipo no válido";
    }


    return (rawProbability * 100).toFixed(2) + '%';
}


// Parámetros del problema de los accidentes (λ = 3)
const lambda = 3;

// a) Probabilidad de EXACTAMENTE 5 accidentes
//console.log(`La probabilidad de exactamente 5 accidentes es: ${poissonProbability(lambda, 5, 'exact')}`);


// b) Probabilidad de MENOS DE 3 accidentes
//console.log(`La probabilidad de menos de 3 accidentes es: ${poissonProbability(lambda, 3, 'lessThan')}`);


// c) Probabilidad de AL MENOS 2 accidentes
//console.log(`La probabilidad de al menos 2 accidentes es: ${poissonProbability(lambda, 2, 'atLeast')}`);





function exponentialProbability(lambda, x, type = 'atMost') {
    if (lambda <= 0 || x < 0) {
        return "Error: lambda debe ser positivo y x no puede ser negativo.";
    }

    let rawProbability = 0;

    switch (type) {
        case 'atMost':
            // Probabilidad de que el evento ocurra en un tiempo menor o igual a x: P(X ≤ x)
            // Esta es la Función de Distribución Acumulada (CDF)
            rawProbability = 1 - Math.exp(-lambda * x);
            break;

        case 'moreThan':
            // Probabilidad de que el evento ocurra en un tiempo mayor a x: P(X > x)
            // Esto es el complemento de la CDF (1 - P(X ≤ x))
            rawProbability = Math.exp(-lambda * x);
            break;

        default:
            return "Error: Tipo no válido. Usa 'atMost' o 'moreThan'.";
    }

    // Formatea el resultado final a un porcentaje con 2 decimales
    return (rawProbability * 100).toFixed(2) + '%';
}



const lambda2 = 1 / 15;

console.log(`a) ${exponentialProbability(lambda2, 30, 'moreThan')}`);


function getRawExponentialProb(lambda, x) {
    if (lambda <= 0 || x < 0) return 0;
    return 1 - Math.exp(-lambda * x); // Devuelve P(X <= x)
}

// Ejemplo de uso

const prob_atMost_10 = getRawExponentialProb(lambda2, 10); // P(X <= 10)
const prob_atMost_5 = getRawExponentialProb(lambda2, 5);   // P(X <= 5)
const probBetween = prob_atMost_10 - prob_atMost_5;

//console.log(`c) ${(probBetween * 100).toFixed(2)}%`);
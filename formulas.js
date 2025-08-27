function redondear(num, decimales) {
    let factor = Math.pow(10, decimales);
    return Math.round(num * factor) / factor;
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
        let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function getColaNoLimite1Servidor(lambda, mu, k){
    let results = [];

    let rho = lambda/mu;
    let P0 = 1 - rho;
    let Ls = rho / (1 - rho);
    let Lq = (rho * rho) / (1 - rho);
    let Ws = Ls/lambda;
    let Wq = Lq/lambda;

    results.push({name: "rho", value: redondear(rho, 6)});
    results.push({name: "Wq", value: redondear(Wq, 6)});
    results.push({name: "Ws", value: redondear(Ws, 6)});
    results.push({name: "Lq", value: redondear(Lq, 6)});
    results.push({name: "Ls", value: redondear(Ls, 6)});

    distribution = [];
    let Fn = 0;
    for(let n = 0; n <= k; n++){
        let Pn = P0 * rho**n;
        let PnRounded = redondear(Pn, 6); // Guardar el valor redondeado de Pn
        Fn += Pn;
        let FnRounded = redondear(Fn, 6); // Guardar el valor redondeado de Fn

        distribution.push({n: n, Pn: PnRounded, Fn: FnRounded});
    }
    results.push({name: "distribution", value: distribution});
    return results;
}

function getColaLimite1Servidor(lambda, mu, cola){
    let N = cola+1
    let results = [];
    
    let rho = lambda/mu;
    let P0 = (1-rho)/(1-rho**(N+1));
    let Ls = (rho * (1 - (N + 1) * rho**N + N * rho**(N + 1))) / ((1 - rho) * (1 - rho**(N + 1)));
    let PN = P0*rho**N;
    let lambdaEfect = lambda*(1-PN);
    let lambdaPerd = lambda-lambdaEfect;
    let Lq = Ls-lambdaEfect/mu;
    let Wq = Lq/lambdaEfect;
    let Ws = Wq+1/mu;

    results.push({name: "rho", value: redondear(rho, 6)});
    results.push({name: "Wq", value: redondear(Wq, 6)});
    results.push({name: "Ws", value: redondear(Ws, 6)});
    results.push({name: "Lq", value: redondear(Lq, 6)});
    results.push({name: "Ls", value: redondear(Ls, 6)});
    results.push({name: "lambdaEfect", value: redondear(lambdaEfect, 6)});
    results.push({name: "lambdaPerd", value: redondear(lambdaPerd, 6)});

    distribution = [];
    let Fn = 0;
    for(let n = 0; n <= N; n++){
        let Pn = P0 * rho**n;
        let PnRounded = redondear(Pn, 6); // Guardar el valor redondeado de Pn
        Fn += Pn;
        let FnRounded = redondear(Fn, 6); // Guardar el valor redondeado de Fn

        distribution.push({n: n, Pn: PnRounded, Fn: FnRounded});
    }
    results.push({name: "distribution", value: distribution});
    return results;
}

function getColaNoLimiteNServidor(lambda, mu, C, k){
    results = [];

    let rho = lambda/mu;
    let P0 = 0;
    for (i = 0; i <= C; i++){
        if(i == C){
            P0 += rho**C/(factorial(C)*(1-rho/C));
        }
        else
        {
            P0 += rho**i/factorial(i);
        }
    }
    P0 = 1/P0;
    console.log(P0);
    let PC = rho**C/factorial(C)*P0;
    let Lq = (rho*C*PC)/(C-rho)**2
    let Ls = rho+Lq;
    let Wq = Lq/lambda;
    let Ws = Wq+1/mu;

    results.push({name: "rho", value: redondear(rho, 6)});
    results.push({name: "Wq", value: redondear(Wq, 6)});
    results.push({name: "Ws", value: redondear(Ws, 6)});
    results.push({name: "Lq", value: redondear(Lq, 6)});
    results.push({name: "Ls", value: redondear(Ls, 6)});

    distribution = [];
    let Fn = 0;
    for(let n = 0; n <= k; n++){
        let Pn = 0;
        if(n<=C){
            Pn = rho**n/factorial(n)*P0;
        }
        else
        {
            Pn = (rho**n*P0)/(C**(n-C)*factorial(C));
        }
        let PnRounded = redondear(Pn, 6); // Guardar el valor redondeado de Pn
        Fn += Pn;
        let FnRounded = redondear(Fn, 6); // Guardar el valor redondeado de Fn

        distribution.push({n: n, Pn: PnRounded, Fn: FnRounded});
    }
    results.push({name: "distribution", value: distribution});
    return results;
}

console.log(JSON.stringify(getColaNoLimiteNServidor(0.25, 0.1, 3, 60), null, 4));
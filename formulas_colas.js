function redondear(num, decimales) {
    const factor = Math.pow(10, decimales);
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

    const rho = lambda/mu;
    const P0 = 1 - rho;
    const Ls = rho / (1 - rho);
    const Lq = (rho * rho) / (1 - rho);
    const Ws = Ls/lambda;
    const Wq = Lq/lambda;

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
    const N = cola+1
    let results = [];
    
    const rho = lambda/mu;
    const P0 = (1-rho)/(1-rho**(N+1));
    const Ls = (rho * (1 - (N + 1) * rho**N + N * rho**(N + 1))) / ((1 - rho) * (1 - rho**(N + 1)));
    const PN = P0*rho**N;
    const lambdaEfect = lambda*(1-PN);
    const lambdaPerd = lambda-lambdaEfect;
    const Lq = Ls-lambdaEfect/mu;
    const Wq = Lq/lambdaEfect;
    const Ws = Wq+1/mu;

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

    const rho = lambda/mu;
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
    const PC = rho**C/factorial(C)*P0;
    const Lq = (rho*C*PC)/(C-rho)**2
    const Ls = rho+Lq;
    const Wq = Lq/lambda;
    const Ws = Wq+1/mu;

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

function getColaLimiteNServidor(lambda, mu, C, cola){
    results = [];

    const N = C + cola;
    const rho = lambda/mu;
    const rhoC = rho/C;
    let P0 = 0;
    for (i = 0; i <= C; i++){
        if(i == C){
            P0 += (rho**C*(1-rhoC**(N-C+1)))/(factorial(C)*(1-rhoC));
        }
        else
        {
            P0 += rho**i/factorial(i);
        }
    }
    P0 = 1/P0;
    const PN = (rho**N*P0)/(C**(N-C)*factorial(C));
    const lambdaEfect = lambda*(1-PN);
    const lambdaPerd = lambda-lambdaEfect;
    const Lq = ((P0*rho**(C+1))/(factorial(C-1)*(C-rho)**2))*(1-rhoC**(N-C)-(N-C)*rhoC**(N-C)*(1-rhoC));
    const Ls = Lq+lambdaEfect/mu;
    const Wq = Lq/lambdaEfect;
    const Ws = Wq+1/mu;
    let cnPn = 0;

    distribution = [];
    let Fn = 0;
    for(let n = 0; n <= N; n++){
        let Pn = 0;
        if(n<=C){
            Pn = rho**n/factorial(n)*P0;
            cnPn += (C-n)*Pn;
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

    const Cactivos = C-cnPn;

    results.push({name: "rho", value: redondear(rho, 6)});
    results.push({name: "Wq", value: redondear(Wq, 6)});
    results.push({name: "Ws", value: redondear(Ws, 6)});
    results.push({name: "Lq", value: redondear(Lq, 6)});
    results.push({name: "Ls", value: redondear(Ls, 6)});
    results.push({name: "lambdaEfect", value: redondear(lambdaEfect, 6)});
    results.push({name: "lambdaPerd", value: redondear(lambdaPerd, 6)});
    results.push({name: "Cactivos", value: redondear(Cactivos, 6)});
    results.push({name: "Cinactivos", value: redondear(cnPn, 6)});

    return results;
}

console.log(JSON.stringify(getColaLimiteNServidor(0.25, 0.1, 3, 13), null, 4));
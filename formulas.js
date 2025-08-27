function redondear(num, decimales) {
    let factor = Math.pow(10, decimales);
    return Math.round(num * factor) / factor;
}

function getColaNoLimite1Servidor(lambda, mu, k){
    let results = [];

    let rho = redondear(lambda/mu, 6);
    let P0 = redondear(1 - rho, 6);
    let Ls = redondear(rho / (1 - rho), 6);
    let Lq = redondear((rho * rho) / (1 - rho), 6);
    let Ws = redondear(Ls/lambda, 6);
    let Wq = redondear(Lq/lambda, 6);

    results.push({name: "rho", value: rho});
    results.push({name: "Wq", value: Wq});
    results.push({name: "Ws", value: Ws});
    results.push({name: "Lq", value: Lq});
    results.push({name: "Ls", value: Ls});

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

console.log(JSON.stringify(getColaNoLimite1Servidor(0.125, 1/6, 20), null, 4));
console.log(JSON.stringify(getColaLimite1Servidor(0.125, 1/6, 5), null, 4));
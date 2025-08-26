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
    results.push({name: "P0", value: P0});
    results.push({name: "Ls", value: Ls});
    results.push({name: "Lq", value: Lq});
    results.push({name: "Ws", value: Ws});
    results.push({name: "Wq", value: Wq});

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

console.log(JSON.stringify(getColaNoLimite1Servidor(0.125, 1/6, 20), null, 4));
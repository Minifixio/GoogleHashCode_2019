import * as fs from 'fs';

const ROOT_PATH = process.cwd();
const filename = 'a_example';
const input = fs.readFileSync(`${ROOT_PATH}/assets/practice/in/${filename}.in`, 'utf8');

const maxSlices_M: number = +input.split('\n')[0].split(' ')[0];
const typesOfPizza_N: number = +input.split('\n')[0].split(' ')[1];
const slicesPerType: number[] = input
  .split('\n')[1]
  .split(' ')
  .map(x => +x);

console.log("Emile est très faible");
console.log(`${maxSlices_M} slices maximum, ${typesOfPizza_N} different types of pizza`);
console.log(`Slides per types : ${slicesPerType}`);

const solve = (max, n, inputs) => {

    let index;
    let solve = [];
    let total = 0;

    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        index = i;
        let tempsolve = [];

        for (let j = index; j >= 0; j--) {

            let value = Number(inputs[j]);

            let tempsum = sum + value;

            if (tempsum == max) {
                sum = tempsum;
                tempsolve.unshift(j);
                break;
            }
            else if (tempsum > max) {
                continue;
            }
            else if (tempsum < max) {
                sum = tempsum;
                tempsolve.unshift(j);
                continue;
            }
        }

        if (total < sum) {
            total = sum;
            solve = tempsolve;
        }

    }
    console.log("Max Score: ", total);
    console.log("No. of Pizzas: ", solve.length);
    console.log(solve.join(" "));

    fs.writeFile(`${ROOT_PATH}/assets/practice/out/${filename}.out`, `${solve.length}\n${solve.join(" ")}`,  function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("Output file created!");
    });
}

solve(maxSlices_M, typesOfPizza_N, slicesPerType);
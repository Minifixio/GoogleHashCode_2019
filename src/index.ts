import * as fs from 'fs';

class Book{
    index: number;
    weight: number;
    sent:boolean = false;
    occurences: number = 0;
}

class Library{
    index: number;
    latency: number;
    rate: number; // Number of books per day
    remainingBooks: Book[];
    sentBooks: Book[] = [];
    signedUp: boolean = false;
    remainingSignupDays: number;

    sendBestBook = ():Book[] => {
        let min = Math.min(this.remainingBooks.length, this.rate);
        let booksToSend = this.remainingBooks.filter(b => !books[b.index].sent).splice(0, min);

        booksToSend.forEach(b =>  {
            b.sent = true;
            books[b.index].sent = true;
        });

        this.sentBooks = this.sentBooks.concat(booksToSend);
        return booksToSend;
    }

    score = (currentDay: number):number => {
        let maxScanned = (maxDays - currentDay - this.latency) * this.rate;
        return this.remainingBooks.slice(0, maxScanned).reduce((sum, b) => (sum + b.weight/books[b.index].occurences)/this.latency, 0);
    }
}

const ROOT_PATH = process.cwd();
const filename = 'f';
const input = fs.readFileSync(`${ROOT_PATH}/assets/official/in/${filename}.txt`, 'utf8');


let currentSignUp: Library;
let libraries: Library[] = [];
let books: Book[] = [];
let score: number = 0;
let solution: Library[] = [];

const lines = input.trim().split('\n');
const firstLine = lines[0].split(' ');
const maxDays: number = Number(firstLine[2]);

// load books
lines[1].split(' ').forEach((w, i) => {
    let b = new Book();
    b.index = i;
    b.weight = Number(w);
    books.push(b);
});

console.log('Processing file', filename, ', MaxScore : ', books.reduce((sum, b) => sum + b.weight, 0).toLocaleString());

// Load Libraries
for(let i = 2; i < lines.length; i += 2){
    let specs = lines[i].split(' ');
    let l = new Library();
    l.latency = Number(specs[1]);
    l.remainingSignupDays = l.latency;
    l.rate = Number(specs[2]);
    libraries.push(l);
    l.index = libraries.length - 1;
    l.remainingBooks = lines[i+1].split(' ').map(index => Object.assign({}, books[index])).sort((b1,b2) => b2.weight - b1.weight);
    l.remainingBooks.forEach(b => { books[b.index].occurences++; b.occurences++}); // Increment global and library book occurence
    //l.score = (l.remainingBooks.reduce((sum, b) => sum += b.weight, 0)) / l.remainingBooks.length;
}



//libraries.sort((l1,l2) => l2.score - l1.score);

///console.log(JSON.stringify(libraries, null, 2));
//console.log(JSON.stringify(books, null, 2));

let chooseNext = (currentDay: number):Library => 
    libraries
        .filter(l => !l.signedUp)
        .sort((l1, l2) => l1.latency === l2.latency ? l2.rate - l1.rate : l1.latency - l2.latency )[0]; // low latency first
        //.sort((l1, l2) => l2.score(currentDay) - l1.score(currentDay))[0];;

let computeScore = (sBooks:Book[]):number => {
    return sBooks.reduce((sum, b) => {
        let w = books[b.index].weight;
        books[b.index].weight = 0; // Prevent duplicate weights
        return sum + w;
    }, 0);
};

// Main part
for(let d:number = 0; d < maxDays; d++){
    if(currentSignUp){
        currentSignUp.remainingSignupDays--;
        if(currentSignUp.remainingSignupDays === 0){
            currentSignUp.signedUp = true;
            solution.push(currentSignUp);
            currentSignUp = chooseNext(d);
        }
    } else {
        currentSignUp = chooseNext(d);
    }
    //console.log(d, currentSignUp);
    libraries
        .filter(l => l.signedUp)
        .forEach(l => {
            score += computeScore(l.sendBestBook());
        });
}

let output = `${solution.length}\n`;
solution.forEach(l => {
    output += `${l.index} ${l.sentBooks.length}\n`
    output += `${l.sentBooks.map(b => b.index).join(' ')}\n`;
});

//console.log(libraries);
//console.log(books);
console.log('========');
console.log('Output');
//console.log(output);
console.log('Score : ', score.toLocaleString());


fs.writeFile(`${ROOT_PATH}/assets/official/out/${filename}.out`, output,
    function(err) {
        if (err) {
            return console.error(err);
        }
    console.log("Output file created!");
});
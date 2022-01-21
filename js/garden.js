const NUMSPECIES = 1;
const MAXAGE = 50;
const MAXFLOWERS = 16;
const DAYLENGTH = 10;
const BIRTHCYCLE = 3;
const GARDEN = document.getElementById("garden");
let flowers = [null, null, null, null,null, null, null, null,null, null, null, null,null, null, null, null];
let pruned = 0;
let age = 1;
let timer;


class Flower {
    constructor(species, primaryColor, secondaryColor, pos) {
        this.empty = true;
        this.species = species;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.age = 0;
        if (this.species === "random"){
            this.species = Math.floor(Math.random()*NUMSPECIES)
        }
        if (this.primaryColor === "random"){
            this.primaryColor = multipleRandomStarterHexDigits(6)
        }
        if (this.secondaryColor === "random"){
            this.secondaryColor = multipleRandomStarterHexDigits(6)
        }
        this.img = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196.6 196.6" onclick="prune(${pos})">
        <path fill="#${this.primaryColor}" d="M196.6,98.3c0-5.4-12.2-9.9-28.4-11.1,15.1-6.1,25.3-14.2,23.6-19.3s-14.6-5.7-30.5-1.7c12.5-10.5,19.7-21.3,16.5-25.7s-15.7-.9-29.5,7.8c8.6-13.9,12.1-26.3,7.8-29.5s-15.2,4-25.7,16.5c3.9-15.8,3.4-28.8-1.7-30.5s-13.2,8.5-19.3,23.6C108.2,12.1,103.7,0,98.3,0S88.4,12.2,87.2,28.4C81.1,13.3,73,3.1,67.9,4.8s-5.7,14.6-1.7,30.5C55.7,22.8,44.9,15.6,40.5,18.8s-.9,15.7,7.8,29.5C34.4,39.7,22,36.2,18.8,40.5s4,15.2,16.5,25.7C19.5,62.3,6.5,62.8,4.8,67.9s8.5,13.2,23.6,19.3C12.1,88.4,0,92.9,0,98.3s12.2,9.9,28.4,11.1c-15.1,6.1-25.3,14.2-23.6,19.3s14.6,5.7,30.5,1.7c-12.5,10.5-19.7,21.3-16.5,25.7s15.7.9,29.5-7.8c-8.6,13.9-12.1,26.3-7.8,29.5s15.2-4,25.7-16.5c-3.9,15.8-3.4,28.8,1.7,30.5s13.2-8.5,19.3-23.6c1.2,16.3,5.7,28.4,11.1,28.4s9.9-12.2,11.1-28.4c6.1,15.1,14.2,25.3,19.3,23.6s5.7-14.6,1.7-30.5c10.5,12.5,21.3,19.7,25.7,16.5s.9-15.7-7.8-29.5c13.9,8.6,26.3,12.1,29.5,7.8s-4-15.2-16.5-25.7c15.8,3.9,28.8,3.4,30.5-1.7s-8.5-13.2-23.6-19.3C184.5,108.2,196.6,103.7,196.6,98.3Z"/>
        <circle fill="#${this.secondaryColor}" cx="98.4" cy="98.3" r="38.9"/>
        </svg>
        `
    }
    getGenes(){
        let pc = this.primaryColor
        let sc = this.secondaryColor
        for (let i=0;i<6;i++){
            if(Math.floor(Math.random()*10)==0){
                pc[i] = randomHexDigit()
            }
            if(Math.floor(Math.random()*10)==0){
                sc[i] = randomHexDigit()
            }
        }
        return [pc, sc]
    }
}

function randomHexDigit(){
    return Math.floor(Math.random()*16).toString(16);
}

function randomStarterHexDigit(){
    return Math.floor(Math.random()*2 + 7).toString(16);
}

function multipleRandomStarterHexDigits(num){
    let result = "";
    for (let i=0; i<num; i++){
        result += randomStarterHexDigit();
    }
    return result
}

function multipleRandomHexDigits(num){
    let result = "";
    for (let i=0; i<num; i++){
        result += randomHexDigit();
    }
    return result
}

function renderGame() {
    for (let i=0; i<flowers.length; i++){
        if (flowers[i]){
            document.getElementById(`flower${i+1}`).innerHTML = flowers[i].img;
        } else {
            document.getElementById(`flower${i+1}`).innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196.6 196.6">
            </svg>
            `;
        }
    }
    document.getElementById("pruned").textContent = `Pruned: ${pruned}`
    document.getElementById("age").textContent = `Day: ${age}`
}
function prune(num) {
    flowers[num] = null;
    pruned+=1;
    renderGame();
}
function tick(){
    let toAdd = [["random", "random"]];
    age += 1;
    for (let i=0; i<MAXFLOWERS; i++){
        if (flowers[i]){
            flowers[i].age += 1;
            if (flowers[i].age%BIRTHCYCLE===0){
                toAdd.push(flowers[i].getGenes())
            }
            if (flowers[i].age >= MAXAGE) {
                flowers[i] = null
            }
        }
    }
    // Shuffle potential babies
    //toAdd = toAdd.sort(() => Math.random() - 0.5)
    // add babies
    for (let i=0; i<flowers.length; i++){
        if (!flowers[i] && toAdd.length>=1){
            let genes = toAdd.pop()
            flowers[i] = new Flower(0, genes[0], genes[1], i)
        }
    }
    renderGame();
}
function startGame(){
    document.getElementById("directions").textContent = `Click a flower to prune it from the garden. A day lasts ${DAYLENGTH} seconds. Flowers live ${MAXAGE} days and make seeds every ${BIRTHCYCLE} days.`
    flowers[0] = new Flower(0, "random", "random", 0);
    renderGame()
    timer = window.setInterval(tick, DAYLENGTH*1000);
}
function main() {
    startGame()
}

main()
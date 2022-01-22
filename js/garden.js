const NUMSPECIES = 12;
const MAXAGE = 50;
const NUMFLOWERS = 16;
const DAYLENGTH = 30;
const BIRTHCYCLE = 3;
const MUTATIONCHANCE = 10;
const GARDEN = document.getElementById("garden");
let flowers = [];
let pruned = 0;
let day = 1;
let timer;

let achievements = {
    "True Black": false,
    "Totally Black": false,
    "Real Red": false,
    "Bright Blue": false,
    "Yes it's Yellow": false,
    "Greatly Green": false,
    "Perfect Purple": false,
    "Simply Orange": false
}

const SPECIESNAMES = ["Sunflower", "Primrose", "Coneflower", "Daisy", "Fameflower", "Cinquefoil", "Violet", "Hibiscus", "Campion", "Lily", "Carnation", "Flax"];

class Flower {
    constructor(pos) {
        this.position = pos
        this.dead = true;
        this.species = 0;
        this.primaryColor = "000000";
        this.secondaryColor = "000000";
        this.tertiaryColor = "000000";
        this.age = 0;
        this.img = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"></svg>`;
        this.tip = tippy(document.querySelector(`#flower${this.position}`));
        this.tip.setProps({
            allowHTML: true,
            theme:'simple'
        });
        this.setTooltip();
    }
    getGenes(){
        let sp = this.species
        if(Math.floor(Math.random()*MUTATIONCHANCE)==0){
            sp = Math.floor(Math.random()*NUMSPECIES)
        }

        let pc = ""
        let sc = ""
        let tc = ""
        
        for (let i=0;i<6;i++){
            if(Math.floor(Math.random()*MUTATIONCHANCE)==0){
                pc +=randomHexDigit()
            } else {
                pc+= this.primaryColor[i]
            }
            if(Math.floor(Math.random()*MUTATIONCHANCE)==0){
                sc += randomHexDigit()
            } else{
                sc+= this.secondaryColor[i]
            }
            if(Math.floor(Math.random()*MUTATIONCHANCE)==0){
                tc += randomHexDigit()
            } else{
                tc+= this.tertiaryColor[i]
            }
        }
        return [sp, pc, sc, tc]
    }
    getAge(){
        return this.age
    }
    isDead(){
        return this.dead;
    }
    setTooltip(){
        if (this.dead) {
            this.tip.disable();
        }
        else {
            this.tip.setContent(this.getTooltip());
            this.tip.enable();
        }
    }
    getTooltip(){
        if (this.dead){return '<div class="tooltip"><h3>empty</h3></div>';}
        return `
        <div class="tooltip">
            <h3>${SPECIESNAMES[this.species]}</h3>
            <ul>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 5">
                        <rect width="5" height="5" fill="#${this.primaryColor}"/>
                    </svg>
                    #${this.primaryColor}
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 5">
                        <rect width="5" height="5" fill="#${this.secondaryColor}"/>
                    </svg>
                    #${this.secondaryColor}
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 5">
                        <rect width="5" height="5" fill="#${this.tertiaryColor}"/>
                    </svg>
                    #${this.tertiaryColor}
                </li>
            </ul>
        </div>
        `;
    }
    reset(){
        this.dead = true;
        this.img = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"></svg>
            `;
        this.age = 0;
        this.species = 0;
        this.primaryColor = "000000";
        this.secondaryColor = "000000";
        this.tertiaryColor = "000000";
        this.setTooltip();

        document.getElementById(`flower${this.position}`).innerHTML = this.img;
    }
    birth(species, primaryColor, secondaryColor, tertiaryColor){
        this.species = species;
        if (this.species === "random"){
            this.species = Math.floor(Math.random()*NUMSPECIES)
        }
        this.primaryColor = primaryColor;
        if (this.primaryColor === "random"){
            this.primaryColor = multipleRandomStarterHexDigits(6)
        }
        this.secondaryColor = secondaryColor;
        if (this.secondaryColor === "random"){
            this.secondaryColor = multipleRandomStarterHexDigits(6)
        }
        this.tertiaryColor = tertiaryColor;
        if (this.tertiaryColor === "random"){
            this.tertiaryColor = multipleRandomStarterHexDigits(6)
        }
        
        this.img = makeImg(this.species, this.primaryColor, this.secondaryColor, this.tertiaryColor)
        

        this.age = 0;
        this.dead = false;

        // update the flower
        document.getElementById(`flower${this.position}`).innerHTML = this.img;
        this.setTooltip();

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
    document.getElementById("pruned").textContent = `Pruned: ${pruned}`
    document.getElementById("day").textContent = `Day: ${day}`
}

function prune(num) {
    if(!flowers[num].dead){
        flowers[num].reset();
        pruned+=1;
        renderGame();
    }
}

function makeImg(species, primaryColor, secondaryColor, tertiaryColor) {
    if (species === 0) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#${primaryColor}" d="M196.6,98.3c0-5.4-12.2-9.9-28.4-11.1,15.1-6.1,25.3-14.2,23.6-19.3s-14.6-5.7-30.5-1.7c12.5-10.5,19.7-21.3,16.5-25.7s-15.7-.9-29.5,7.8c8.6-13.9,12.1-26.3,7.8-29.5s-15.2,4-25.7,16.5c3.9-15.8,3.4-28.8-1.7-30.5s-13.2,8.5-19.3,23.6C108.2,12.1,103.7,0,98.3,0S88.4,12.2,87.2,28.4C81.1,13.3,73,3.1,67.9,4.8s-5.7,14.6-1.7,30.5C55.7,22.8,44.9,15.6,40.5,18.8s-.9,15.7,7.8,29.5C34.4,39.7,22,36.2,18.8,40.5s4,15.2,16.5,25.7C19.5,62.3,6.5,62.8,4.8,67.9s8.5,13.2,23.6,19.3C12.1,88.4,0,92.9,0,98.3s12.2,9.9,28.4,11.1c-15.1,6.1-25.3,14.2-23.6,19.3s14.6,5.7,30.5,1.7c-12.5,10.5-19.7,21.3-16.5,25.7s15.7.9,29.5-7.8c-8.6,13.9-12.1,26.3-7.8,29.5s15.2-4,25.7-16.5c-3.9,15.8-3.4,28.8,1.7,30.5s13.2-8.5,19.3-23.6c1.2,16.3,5.7,28.4,11.1,28.4s9.9-12.2,11.1-28.4c6.1,15.1,14.2,25.3,19.3,23.6s5.7-14.6,1.7-30.5c10.5,12.5,21.3,19.7,25.7,16.5s.9-15.7-7.8-29.5c13.9,8.6,26.3,12.1,29.5,7.8s-4-15.2-16.5-25.7c15.8,3.9,28.8,3.4,30.5-1.7s-8.5-13.2-23.6-19.3C184.5,108.2,196.6,103.7,196.6,98.3Z"/>
        <circle fill="#${secondaryColor}" cx="98.4" cy="98.3" r="38.9"/>
        </svg>
        `
    } else if (species === 1) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#${primaryColor}" d="M178.47,54.17c-19.8,0-37.6,5.4-50.1,14,8.6-12.5,14-30.3,14-50.1,0-37.9-19.8-4.4-44.1-4.4s-44.1-33.5-44.1,4.4c0,19.8,5.4,37.6,14,50.1-12.5-8.6-30.3-14-50.1-14-37.9,0-4.4,19.8-4.4,44.1s-33.5,44.1,4.4,44.1c19.8,0,37.6-5.4,50.1-14-8.6,12.5-14,30.3-14,50.1,0,37.9,19.8,4.4,44.1,4.4s44.1,33.5,44.1-4.4c0-19.8-5.4-37.6-14-50.1,12.5,8.6,30.3,14,50.1,14,37.9,0,4.4-19.8,4.4-44.1S216.37,54.17,178.47,54.17Z"/>
        <circle fill="#${secondaryColor}" cx="98.27" cy="98.27" r="26.6"/>
        </svg>
        `
    } else if (species === 2) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#${primaryColor}" d="M196.8,98.4c0-12.3-19-22.2-42.3-22.2h-2.4c.6-.5,1.1-1.1,1.7-1.7,16.5-16.5,22.9-37,14.2-45.7S138.9,26.5,122.3,43l-1.7,1.7V42.3c0-23.4-10-42.3-22.2-42.3S76.2,19,76.2,42.3v2.4c-.5-.6-1.1-1.1-1.7-1.7C58,26.5,37.5,20.1,28.8,28.8S26.5,57.9,43,74.5l1.7,1.7H42.3C18.9,76.2,0,86.2,0,98.4s19,22.2,42.3,22.2h2.4c-.6.5-1.1,1.1-1.7,1.7-16.5,16.5-22.9,37-14.2,45.7s29.1,2.3,45.7-14.2l1.7-1.7v2.4c0,23.4,10,42.3,22.2,42.3s22.2-19,22.2-42.3v-2.4c.5.6,1.1,1.1,1.7,1.7,16.5,16.5,37,22.9,45.7,14.2s2.3-29.1-14.2-45.7l-1.7-1.7h2.4C177.8,120.7,196.8,110.7,196.8,98.4Z"/>
        <circle fill="#${secondaryColor}" cx="98.5" cy="98.4" r="28.4"/>
        </svg>
        `
    } else if (species === 3) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#${primaryColor}" d="M196.2,98.1c0-12.3-3-22.2-26.3-22.2A118.44,118.44,0,0,0,144.2,79a130.21,130.21,0,0,0,20.4-16c16.5-16.5,11.6-25.7,2.9-34.3s-17.8-13.6-34.3,2.9a120.45,120.45,0,0,0-16,20.4,119.17,119.17,0,0,0,3.1-25.7C120.3,2.9,110.3,0,98.1,0S75.9,3,75.9,26.3A118.44,118.44,0,0,0,79,52,130.21,130.21,0,0,0,63,31.6C46.5,15.1,37.3,20,28.7,28.7S15.1,46.5,31.6,63A120.45,120.45,0,0,0,52,79a119.17,119.17,0,0,0-25.7-3.1C2.9,75.9,0,85.9,0,98.1s3,22.2,26.3,22.2A118.44,118.44,0,0,0,52,117.2a130.21,130.21,0,0,0-20.4,16c-16.5,16.5-11.6,25.7-2.9,34.3s17.8,13.6,34.3-2.9a120.45,120.45,0,0,0,16-20.4,119.17,119.17,0,0,0-3.1,25.7c0,23.4,10,26.3,22.2,26.3s22.2-3,22.2-26.3a118.44,118.44,0,0,0-3.1-25.7,130.21,130.21,0,0,0,16,20.4c16.5,16.5,25.7,11.6,34.3,2.9s13.6-17.8-2.9-34.3a120.45,120.45,0,0,0-20.4-16,119.17,119.17,0,0,0,25.7,3.1C193.3,120.4,196.2,110.4,196.2,98.1Z"/>
        <circle fill="#${secondaryColor}" cx="97.9" cy="98.1" r="29.3"/>
        </svg>
        `
    } else if (species === 4) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#${primaryColor}" d="M162.1,108.4a59.4,59.4,0,0,0,33.5-27.5,63,63,0,0,1-14.8-9.7A56.7,56.7,0,0,1,187,54.7a59.21,59.21,0,0,0-64.8,9.9A59.32,59.32,0,0,0,111.6,0,58.64,58.64,0,0,1,97.8,11,61.31,61.31,0,0,1,84,0,59.32,59.32,0,0,0,73.4,64.6,59.21,59.21,0,0,0,8.6,54.7a57.8,57.8,0,0,1,6.2,16.5A58.24,58.24,0,0,1,0,80.9a58.76,58.76,0,0,0,33.5,27.5A59.89,59.89,0,0,0,58.2,111a58.36,58.36,0,0,0-18.5,16.6,59,59,0,0,0-10.9,41.9,61.61,61.61,0,0,1,17.7-.8,59.75,59.75,0,0,1,4.7,17,58.85,58.85,0,0,0,36.5-23.3,59.89,59.89,0,0,0,10.1-22.7,59.38,59.38,0,0,0,46.6,46,58.86,58.86,0,0,1,4.7-17,61.77,61.77,0,0,1,17.7.8,59,59,0,0,0-10.9-41.9A58.36,58.36,0,0,0,137.4,111,58.26,58.26,0,0,0,162.1,108.4Z"/>
        <circle fill="#${secondaryColor}" cx="97.9" cy="98.1" r="23.3"/>
        <path fill="#${secondaryColor}" d="M97.9,98.9a.76.76,0,0,1-.8-.6A38.85,38.85,0,0,1,95.9,88v-.1A46,46,0,0,1,97,82.1c.3-1.3.7-2.6.9-4a31.63,31.63,0,0,0-.8-12.6.82.82,0,1,1,1.6-.4,33.32,33.32,0,0,1,.9,13.3c-.2,1.5-.6,2.9-.9,4.2a33.48,33.48,0,0,0-1.1,5.5,39.53,39.53,0,0,0,1.1,9.8.8.8,0,0,1-.6,1Z"/>
        <path fill="#${secondaryColor}" d="M97.9,98.9a29.5,29.5,0,0,1-11.5-2.7h-.1a42.33,42.33,0,0,1-4.2-2.5A24.72,24.72,0,0,0,75,90.2a16,16,0,0,1-2.1-.5,28.44,28.44,0,0,0-6.3-1,.8.8,0,0,1,0-1.6,30.13,30.13,0,0,1,6.7,1c.7.2,1.4.3,2.1.5A29.83,29.83,0,0,1,83,92.3a40.18,40.18,0,0,0,4.1,2.4A29.16,29.16,0,0,0,98,97.2a.79.79,0,0,1,.8.8A1.06,1.06,0,0,1,97.9,98.9Z"/>
        <path fill="#${secondaryColor}" d="M78.6,125.4a.37.37,0,0,1-.3-.1,1,1,0,0,1-.5-1.1c2.7-6.5,7.3-11.2,12.3-16.1a24.64,24.64,0,0,0,7-10.3.85.85,0,0,1,1.6.6,26.19,26.19,0,0,1-7.4,11c-4.8,4.8-9.4,9.4-11.9,15.5A1,1,0,0,1,78.6,125.4Z"/>
        <path fill="#${secondaryColor}" d="M117.1,125.4c-.2,0-.3-.1-.5-.2a25.54,25.54,0,0,1-7.4-8.9c-1-1.7-1.9-3.5-2.8-5.2-2.5-4.8-4.8-9.3-9.1-12.4a.86.86,0,1,1,1-1.4c4.6,3.3,7.1,8.2,9.6,13l2.7,5.1a24.73,24.73,0,0,0,7,8.4.83.83,0,0,1,.2,1.2A.67.67,0,0,1,117.1,125.4Z"/>
        <path fill="#${secondaryColor}" d="M97.9,98.9a.75.75,0,0,1-.7-.4.8.8,0,0,1,.3-1.1,32.6,32.6,0,0,1,15.4-5,32.47,32.47,0,0,0,13.4-3.6,10.85,10.85,0,0,1,2.8-1.5.85.85,0,1,1,.6,1.6,19.34,19.34,0,0,0-2.4,1.3h-.1A33.27,33.27,0,0,1,113,94a30.82,30.82,0,0,0-14.6,4.8A1.09,1.09,0,0,1,97.9,98.9Z"/>
        <path fill="#${secondaryColor}" d="M126.9,100.2a32.06,32.06,0,0,1-6.8-.7C112,98,105.2,97,98,98.9a.82.82,0,0,1-.4-1.6c7.5-2,14.5-1,22.8.6a30.26,30.26,0,0,0,15.2-.6.82.82,0,1,1,.4,1.6A32.28,32.28,0,0,1,126.9,100.2Z"/>
        <path fill="#${secondaryColor}" d="M97.9,98.9h0a.82.82,0,0,1-.8-.9c.3-7.5,3.7-14.2,7-20.6.6-1.1,1.2-2.2,1.7-3.3a30.51,30.51,0,0,0,3.1-12.3.85.85,0,0,1,1.7.1,32.33,32.33,0,0,1-3.3,13c-.6,1.1-1.1,2.2-1.7,3.4C102.4,84.6,99,91,98.8,98.2A1.11,1.11,0,0,1,97.9,98.9Z"/>
        <path fill="#${secondaryColor}" d="M97.9,98.9a.37.37,0,0,1-.3-.1,39.6,39.6,0,0,1-12.3-7.6l-.1-.1-.1-.1a5.35,5.35,0,0,0-1.3-1.3c-.2-.2-.5-.4-.7-.6L83,89c-4.9-6.1-10.4-10.4-16.3-12.7a.85.85,0,0,1,.6-1.6c6.2,2.4,12,6.9,17,13.2l.5.5a10.61,10.61,0,0,1,1.5,1.5,39.51,39.51,0,0,0,11.8,7.3,1,1,0,0,1,.5,1.1A.73.73,0,0,1,97.9,98.9Z"/>
        <path fill="#${secondaryColor}" d="M67.1,121.4c-.2,0-.3-.1-.5-.2a.83.83,0,0,1-.2-1.2,39.56,39.56,0,0,1,8.5-8c.5-.3,1-.6,1.4-.8a7.46,7.46,0,0,0,1.2-.7l.1-.1,1.3-.6c7.1-3.2,13.7-6.3,18.2-12.4a.86.86,0,1,1,1.4,1c-4.7,6.4-11.9,9.7-18.9,12.9l-1.3.6c-.5.3-.9.5-1.3.7a7.46,7.46,0,0,0-1.2.7,35,35,0,0,0-8.1,7.6A.74.74,0,0,1,67.1,121.4Z"/>
        <path fill="#${secondaryColor}" d="M109.7,135.2a.91.91,0,0,1-.7-.3c-3.8-5.1-5.2-11.5-5.9-16.5v-.1c-.7-8.6-2.5-14.7-5.9-19.8a.86.86,0,1,1,1.4-1c3.6,5.3,5.5,11.7,6.2,20.5.7,4.8,2,10.9,5.6,15.7a.83.83,0,0,1-.2,1.2A.91.91,0,0,1,109.7,135.2Z"/>
        <path fill="#${secondaryColor}" d="M89.3,100a71.2,71.2,0,0,1-14-1.7,30.26,30.26,0,0,0-15.2.6.82.82,0,0,1-.4-1.6,33.05,33.05,0,0,1,15.9-.6c8.1,1.5,14.9,2.5,22.1.6a.82.82,0,1,1,.4,1.6A33.69,33.69,0,0,1,89.3,100Z"/>
        <path fill="#${secondaryColor}" d="M86.1,135.2h0a.77.77,0,0,1-.8-.9,32.33,32.33,0,0,1,3.3-13c.6-1.1,1.1-2.2,1.7-3.4,3.2-6.3,6.6-12.7,6.8-19.9a.85.85,0,0,1,1.7.1c-.3,7.5-3.7,14.2-7,20.6-.6,1.1-1.2,2.2-1.7,3.3A30.51,30.51,0,0,0,87,134.3,1.06,1.06,0,0,1,86.1,135.2Z"/>
        <path fill="#${secondaryColor}" d="M128.7,121.4a.37.37,0,0,1-.3-.1c-6.2-2.4-12-6.9-17-13.2l-.5-.5a10.61,10.61,0,0,1-1.5-1.5,39.51,39.51,0,0,0-11.8-7.3,1,1,0,0,1-.5-1.1.76.76,0,0,1,1.1-.5,39.6,39.6,0,0,1,12.3,7.6l.1.1.1.1a5.35,5.35,0,0,0,1.3,1.3c.2.2.5.4.7.6l.1.1c4.9,6.1,10.4,10.4,16.3,12.7a1,1,0,0,1,.5,1.1A1.21,1.21,0,0,1,128.7,121.4Z"/>
        <path fill="#${secondaryColor}" d="M97.9,98.9a.76.76,0,0,1-.5-.2.93.93,0,0,1-.2-1.2,35.16,35.16,0,0,1,11.2-9.4l1.4-.6c7.1-3.2,13.7-6.3,18.2-12.4a.86.86,0,1,1,1.4,1c-4.7,6.4-11.9,9.7-18.9,12.9l-1.3.6a32.84,32.84,0,0,0-10.6,9A1.08,1.08,0,0,1,97.9,98.9Z"/>
        <path fill="#${secondaryColor}" d="M97.9,98.9a.75.75,0,0,1-.7-.4C93.6,93.2,91.7,86.8,91,78c-.7-4.8-2-10.9-5.6-15.7a.86.86,0,0,1,1.4-1c3.8,5.1,5.2,11.5,5.9,16.5v.1c.7,8.6,2.5,14.7,5.9,19.8a.83.83,0,0,1-.2,1.2Z"/>        
        <circle fill="#${secondaryColor}" cx="109.7" cy="61.8" r="2.2"/><circle fill="#${secondaryColor}" cx="97.9" cy="65.3" r="2.2"/>
        <circle fill="#${secondaryColor}" cx="66.5" cy="88" r="2.2"/><circle fill="#${secondaryColor}" cx="78.6" cy="124.5" r="2.2"/>
        <circle fill="#${secondaryColor}" cx="117.1" cy="124.5" r="2.2"/><circle fill="#${secondaryColor}" cx="129.2" cy="88" r="2.2"/>
        <circle fill="#${secondaryColor}" cx="86.1" cy="61.8" r="2.2"/><circle fill="#${secondaryColor}" cx="67.1" cy="75.6" r="2.2"/>
        <circle fill="#${secondaryColor}" cx="128.7" cy="75.6" r="2.2"/><circle fill="#${secondaryColor}" cx="59.9" cy="98.2" r="2.2"/>
        <circle fill="#${secondaryColor}" cx="67.1" cy="120.5" r="2.2"/><circle fill="#${secondaryColor}" cx="85.9" cy="134.3" r="2.2"/>
        <circle fill="#${secondaryColor}" cx="109.7" cy="134.3" r="2.2"/><circle fill="#${secondaryColor}" cx="128.7" cy="120.5" r="2.2"/>
        <circle fill="#${secondaryColor}" cx="135.9" cy="98.2" r="2.2"/>
        </svg>
        `
    } else if (species === 5) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#${primaryColor}" d="M193.87,91.88c-1.2-9.4-2.5-20.1-.4-33.2a14.1,14.1,0,0,0-3.9-12.21,14.4,14.4,0,0,0-11-4,83.38,83.38,0,0,0-53.2,23.11,1,1,0,0,1-1.5-1.3c1.5-2.2,3.2-4.6,5.3-7.2,6.7-8.61,13.4-16.5,17.1-26a12.5,12.5,0,0,0,.8-4.21,11.3,11.3,0,0,0-6.2-10.1c-5.4-2.8-11.6-3.9-18.8-5.3-9.3-1.79-19.9-3.79-31.7-9.89a13.73,13.73,0,0,0-12.8,0,14.43,14.43,0,0,0-7.2,9.2A83.07,83.07,0,0,0,76,68.58a1,1,0,0,1-1.7,1.1c-1.6-2.1-3.4-4.5-5.3-7.3-6.2-9-11.5-17.8-19.4-24.3a11.12,11.12,0,0,0-3.7-2,11.64,11.64,0,0,0-11.6,2.7C30,43.08,27,48.58,23.37,55c-4.6,8.3-9.8,17.8-19.2,27a13.92,13.92,0,0,0,2.6,21.9,83.26,83.26,0,0,0,56.6,12.6,1,1,0,0,1,.5,1.9c-2.5.9-5.3,1.8-8.5,2.8-10.5,3.1-20.5,5.4-29.1,11a12.29,12.29,0,0,0-3.1,2.9,11.39,11.39,0,0,0-1,11.8c2.7,5.4,7.1,10,12.1,15.3,6.5,6.9,13.9,14.8,19.8,26.6a13.73,13.73,0,0,0,10.4,7.6,14.62,14.62,0,0,0,11.2-3.2,83.79,83.79,0,0,0,29.5-50,1,1,0,0,1,2,.1q.15,3.89,0,9c-.3,10.9-1.2,21.2,1.4,31.09a11.91,11.91,0,0,0,1.8,3.8,11.52,11.52,0,0,0,11,4.6c6-.9,11.7-3.6,18.3-6.7,8.6-4.1,18.3-8.6,31.4-10.6a14,14,0,0,0,10.4-7.5,14.44,14.44,0,0,0,.4-11.7,83.82,83.82,0,0,0-38.4-43.5,1,1,0,0,1,.7-1.8c2.5.7,5.3,1.6,8.5,2.8,10.3,3.7,19.8,7.7,30,8.2a11.56,11.56,0,0,0,4.2-.5,11.33,11.33,0,0,0,7.7-9C195.57,105.38,194.77,99.08,193.87,91.88Z"/>
        <circle fill="#${secondaryColor}" cx="102.57" cy="101.08" r="25.9"/>
        </svg>
        `
    } else if (species === 6) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#${primaryColor}" d="M186.64,88.7c-3-16.4.5-20.9.5-20.9s-5.5-1.6-12.7-16.6c-6.9-14.5-21.8-23.3-38.2-11.6,6-19.2-7-30.6-22.9-32.7C96.84,4.7,93.64,0,93.64,0s-3.2,4.7-19.7,6.9C58,9,45,20.4,51,39.6c-16.4-11.7-31.3-2.9-38.2,11.6C5.64,66.2.14,67.8.14,67.8s3.5,4.5.5,20.9c-2.9,15.8,3.9,31.7,24.1,31.9-16.2,12-12.4,28.9-.7,39.9,12.1,11.5,11.9,17.2,11.9,17.2s5.4-1.9,20,6c14.1,7.7,31.3,6.1,37.8-13,6.4,19.1,23.6,20.7,37.8,13,14.6-7.9,20-6,20-6s-.2-5.7,11.9-17.2c11.7-11.1,15.4-27.9-.7-39.9C182.74,120.4,189.54,104.5,186.64,88.7Z"/>
        <circle fill="#${secondaryColor}" cx="93.64" cy="98.2" r="31.8"/>
        <polygon fill="#${secondaryColor}" points="88.64 98.2 93.64 30.9 98.64 98.2 88.64 98.2"/>
        <polygon fill="#${secondaryColor}" points="92.04 103 29.54 77.4 95.14 93.4 92.04 103"/>
        <polygon fill="#${secondaryColor}" points="97.64 101.1 54.04 152.7 89.54 95.3 97.64 101.1"/>
        <polygon fill="#${secondaryColor}" points="97.64 95.3 133.24 152.7 89.54 101.1 97.64 95.3"/>
        <polygon fill="#${secondaryColor}" points="92.04 93.4 157.64 77.4 95.14 103 92.04 93.4"/></svg>
        `
    } else if (species === 7) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#${primaryColor}" d="M176.17,73.08a17.27,17.27,0,0,0-19.3-6.4h0a17.33,17.33,0,0,0,11.9-16.5c-.1-15.8-1.7-41.6-10.1-47.7s-33.4.4-48.4,5.2a17.29,17.29,0,0,0-12,16.4h0a17.29,17.29,0,0,0-12-16.4c-15.1-4.8-40-11.3-48.4-5.2s-9.9,31.8-10.1,47.7a17.07,17.07,0,0,0,11.9,16.5h0a17.27,17.27,0,0,0-19.3,6.4c-9.2,12.9-23.1,34.6-19.9,44.5s27.2,19.3,42.2,24.3a17,17,0,0,0,19.3-6.2h0a17.1,17.1,0,0,0,.1,20.3c9.4,12.7,25.8,32.6,36.2,32.6s26.8-19.9,36.2-32.6a17.1,17.1,0,0,0,.1-20.3h0a17,17,0,0,0,19.3,6.2c15-5,39-14.4,42.2-24.3S185.37,86,176.17,73.08Z"/>
        <path fill="#${secondaryColor}" d="M157.07,104.28a312.8,312.8,0,0,0-41.3-18.7,6.6,6.6,0,0,1-3.2-10,293.33,293.33,0,0,0,23.6-42A295.48,295.48,0,0,0,103.57,69a6.68,6.68,0,0,1-10.5,0,303.3,303.3,0,0,0-32.6-35.4,298.85,298.85,0,0,0,23.6,42,6.72,6.72,0,0,1-3.2,10,288.08,288.08,0,0,0-43.7,20.1,301,301,0,0,0,47.2-9.4,6.65,6.65,0,0,1,8.5,6.2,294.18,294.18,0,0,0,5.6,47.8,300.37,300.37,0,0,0,5.6-48.2,6.63,6.63,0,0,1,8.1-6.3c15.6,3.5,43,7.5,44.9,8.5C156.27,103.88,158.67,105.18,157.07,104.28Z"/>
        <circle fill="#${primaryColor}" cx="98.17" cy="85.78" r="8.4"/></svg>
        `
    } else if (species === 8) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#${primaryColor}" d="M162.1,108.4a59.4,59.4,0,0,0,33.5-27.5,63,63,0,0,1-14.8-9.7A56.7,56.7,0,0,1,187,54.7a59.21,59.21,0,0,0-64.8,9.9A59.32,59.32,0,0,0,111.6,0,58.64,58.64,0,0,1,97.8,11,61.31,61.31,0,0,1,84,0,59.32,59.32,0,0,0,73.4,64.6,59.21,59.21,0,0,0,8.6,54.7a57.8,57.8,0,0,1,6.2,16.5A58.24,58.24,0,0,1,0,80.9a58.76,58.76,0,0,0,33.5,27.5A59.89,59.89,0,0,0,58.2,111a58.36,58.36,0,0,0-18.5,16.6,59,59,0,0,0-10.9,41.9,61.61,61.61,0,0,1,17.7-.8,59.75,59.75,0,0,1,4.7,17,58.85,58.85,0,0,0,36.5-23.3,59.89,59.89,0,0,0,10.1-22.7,59.38,59.38,0,0,0,46.6,46,58.86,58.86,0,0,1,4.7-17,61.77,61.77,0,0,1,17.7.8,59,59,0,0,0-10.9-41.9A58.36,58.36,0,0,0,137.4,111,59.89,59.89,0,0,0,162.1,108.4Z"/>
        <circle fill="#${secondaryColor}" cx="97.9" cy="98.1" r="23.3"/></svg>
        `
    } else if (species === 9) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs><style>.a{fill:#ffcd05;}.b{fill:#f7941e;}.c{fill:#f1f2f2;}</style></defs>
        <path fill="#${primaryColor}" d="M108.6,98.2h0a52.06,52.06,0,0,0,42.5-22.1l18.9-27L137.2,52A51.87,51.87,0,0,0,96.8,77.7a52,52,0,0,0,2.1-47.9L85,0,71.1,29.8a51.72,51.72,0,0,0,2.1,47.9A51.69,51.69,0,0,0,32.8,52L0,49.1l18.9,27A51.8,51.8,0,0,0,61.4,98.2h0a52.06,52.06,0,0,0-42.5,22.1L0,147.3l32.8-2.9a51.87,51.87,0,0,0,40.4-25.7,52,52,0,0,0-2.1,47.9L85,196.4l13.9-29.8a51.72,51.72,0,0,0-2.1-47.9h0a51.69,51.69,0,0,0,40.4,25.7l32.8,2.9-18.9-27A51.66,51.66,0,0,0,108.6,98.2Z"/>
        <path fill="#${tertiaryColor}" d="M100.9,93.7a129.82,129.82,0,0,0,21.7-17.3A131.48,131.48,0,0,0,96.8,86.5,5.42,5.42,0,0,1,89,82a125.16,125.16,0,0,0-4.2-27.4,131.54,131.54,0,0,0-4.2,27.3,5.42,5.42,0,0,1-7.8,4.5A129.09,129.09,0,0,0,47,76.3,130.09,130.09,0,0,0,68.6,93.6a5.42,5.42,0,0,1,0,9A130.09,130.09,0,0,0,47,119.9a129.09,129.09,0,0,0,25.8-10.1,5.42,5.42,0,0,1,7.8,4.5,131.36,131.36,0,0,0,4.1,27.4,125.07,125.07,0,0,0,4.1-27.4,5.42,5.42,0,0,1,7.8-4.5,129.09,129.09,0,0,0,25.8,10.1,130.85,130.85,0,0,0-21.7-17.3A5.42,5.42,0,0,1,100.9,93.7Z"/>
        <circle fill="#${secondaryColor}" cx="84.9" cy="98.2" r="10"/></svg>
        `
    } else if (species === 10) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#${primaryColor}" d="M195.25,91c-2.5-3.1-9.2-5.8-18.1-7.6,7.7-4.7,13.1-9.6,14.4-13.3,2.5-7.5-8-9.3-7.3-12.7a14,14,0,0,0-1.3-8.9,13.85,13.85,0,0,0-7.1-5.6c-3.2-1.1.4-11.2-7.3-12.7-3.9-.8-10.8,1.4-18.7,5.8,2.9-8.6,3.9-15.8,2.4-19.4-2.9-7.4-12.1-2-13.8-5a13.51,13.51,0,0,0-6.7-6,14,14,0,0,0-9,.3c-3.2,1.2-6.9-8.8-13.8-5-3.5,1.9-7.3,8-10.6,16.5C95.05,9,91.15,2.77,87.75.87c-6.9-3.8-10.6,6.2-13.8,5a14,14,0,0,0-9-.3,13.51,13.51,0,0,0-6.7,6c-1.7,3-10.9-2.3-13.8,5-1.4,3.7-.4,10.9,2.4,19.4-7.9-4.3-14.8-6.6-18.7-5.8-7.7,1.5-4.1,11.6-7.3,12.7a13.77,13.77,0,0,0-7.1,5.6,14,14,0,0,0-1.3,8.9c.6,3.4-9.9,5.2-7.3,12.7,1.3,3.7,6.6,8.6,14.4,13.3-8.9,1.8-15.6,4.5-18.1,7.6-4.9,6.1,4.3,11.5,2.5,14.4a12.14,12.14,0,0,0,2.9,16.4c2.6,2.2-4.2,10.3,2.5,14.4,3.4,2,10.6,2.3,19.6,1-5.7,7.1-9,13.5-8.9,17.4.2,7.9,10.7,6,11.2,9.4a13.93,13.93,0,0,0,4.2,7.9,13.5,13.5,0,0,0,8.5,2.8c3.4,0,3.4,10.6,11.2,9.4,3.9-.6,9.6-5,15.6-11.8.2,9.1,1.7,16.1,4.3,19.1,5.2,5.9,12.1-2.2,14.7,0a13.78,13.78,0,0,0,8.3,3.3,13.55,13.55,0,0,0,8.3-3.3c2.6-2.2,9.5,5.9,14.7,0,2.6-3,4.1-10,4.3-19.1,6,6.8,11.7,11.2,15.6,11.8,7.8,1.2,7.8-9.5,11.2-9.4a14.13,14.13,0,0,0,8.5-2.8,13.68,13.68,0,0,0,4.2-7.9c.6-3.4,11.1-1.5,11.2-9.4.1-3.9-3.3-10.4-8.9-17.4,9,1.4,16.2,1.1,19.6-1,6.7-4.1-.1-12.3,2.5-14.4a14.09,14.09,0,0,0,4.7-7.6,14,14,0,0,0-1.8-8.8C191,102.47,200.15,97.17,195.25,91Z"/>
        <path fill="#${secondaryColor}" d="M100.55,95.87c9.2,12.1,18.3,24.2,27.5,36.3C117.25,120.47,101.25,106.77,100.55,95.87Z"/>
        <path fill="#${secondaryColor}" d="M100.55,98.77c-10.3,11.1-20.6,22.3-30.9,33.4C79.25,119.47,90,101.27,100.55,98.77Z"/>
        <path fill="#${secondaryColor}" d="M99.25,95.07c14.8,3.4,29.6,6.7,44.4,10.1C127.85,103.17,106.75,103.07,99.25,95.07Z"/>
        <path fill="#${secondaryColor}" d="M96.75,96.57c5.9-14,11.8-28,17.6-42C109.75,69.77,106,90.47,96.75,96.57Z"/>
        <path fill="#${secondaryColor}" d="M96.75,98.07l-13.5-43.5C89.55,69.27,100,87.57,96.75,98.07Z"/>
        <path fill="#${secondaryColor}" d="M99.25,99.47l-45.1,5.7C69.65,101.67,89.45,94.57,99.25,99.47Z"/>
        <path fill="#${secondaryColor}" d="M101.15,97.27c-.7,15.2-1.5,30.3-2.2,45.5C98.15,126.87,94.55,106.07,101.15,97.27Z"/>
        <path fill="#${secondaryColor}" d="M97.75,95.37c13.5-6.9,27-13.9,40.5-20.8C124.85,83.17,108.65,96.67,97.75,95.37Z"/>
        <path fill="#${secondaryColor}" d="M97.75,99.17C85,91,72.25,82.77,59.45,74.47,73.65,81.87,93.45,89.17,97.75,99.17Z"/>
        <circle fill="#${secondaryColor}" cx="98.85" cy="97.27" r="20.4"/></svg>
        `
    } else if (species === 11) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#${primaryColor}" d="M196.64,89.23c-.9-9.9-13.4-17.9-16.8-19.9,1.6-3.6,7-17.4,1.9-26-2.5-4.1-6.9-6.4-13.4-6.7-13-.7-27.9,8.3-46,27.8a1,1,0,0,1-1.6-1.2c13-23.2,16.9-40.1,12.2-52.3-2.3-6-5.8-9.6-10.5-10.6-9.7-2.2-21.2,7.2-24.1,9.8-2.9-2.6-14.4-12-24.1-9.8-4.7,1.1-8.2,4.6-10.5,10.6-4.7,12.2-.8,29.1,12.2,52.3a1,1,0,0,1-1.6,1.2c-18-19.5-33-28.5-46-27.8-6.4.3-10.9,2.6-13.4,6.7-5.1,8.6.3,22.4,1.9,26-3.4,2-15.9,9.9-16.8,19.9-.4,4.8,1.9,9.3,6.8,13.3,10.1,8.2,27.5,9.8,53.5,4.6a1,1,0,0,1,.6,1.9c-24.1,11.1-37.3,22.6-40.6,35.1-1.7,6.2-.9,11.2,2.3,14.8,6.6,7.5,21.4,6.6,25.3,6.2.8,3.8,4.6,18.2,13.7,22.1a11.49,11.49,0,0,0,4.8,1,18.13,18.13,0,0,0,9.9-3.4c10.9-7.1,17.8-23.1,20.9-49.5a1,1,0,0,1,2,0c3.1,26.4,9.9,42.4,20.9,49.5,5.4,3.5,10.3,4.3,14.8,2.4,9.2-3.9,12.9-18.3,13.7-22.1,3.9.4,18.7,1.3,25.3-6.2,3.2-3.6,3.9-8.6,2.3-14.8-3.4-12.6-16.5-24-40.6-35.1a1,1,0,0,1,.6-1.9c26.1,5.2,43.4,3.6,53.5-4.6C194.74,98.43,197,94,196.64,89.23Z"/>
        <circle fill="#${secondaryColor}" cx="98.34" cy="94.13" r="29.5"/></svg>
        `
    }
}

function tick(){
    let toAdd = [["random", "random", "random", "random"]];
    day += 1;
    for (let i=0; i<NUMFLOWERS; i++){
        if (!flowers[i].dead){
            flowers[i].age += 1;
            if (flowers[i].age%BIRTHCYCLE===0){
                toAdd.push(flowers[i].getGenes())
            }
            if (flowers[i].age >= MAXAGE) {
                flowers[i].reset()
            }
        }
    }
    // Shuffle potential babies
    toAdd = toAdd.sort(() => Math.random() - 0.5)
    // add babies
    for (let i=0; i<NUMFLOWERS; i++){
        if (flowers[i].dead && toAdd.length>=1){
            let genes = toAdd.pop()
            flowers[i].birth(genes[0], genes[1], genes[2], genes[3])
        }
    }
    renderGame();
}
function startGame(){
    for (let i=0;i<NUMFLOWERS;i++){
        flowers.push(new Flower(i));
    }
    document.getElementById("directions").textContent = `Click a flower to prune it from the garden. A day lasts ${DAYLENGTH} seconds. Flowers live ${MAXAGE} days and make seeds every ${BIRTHCYCLE} days.`
    flowers[0].birth("random", "random", "random", "random");
    
    renderGame()
    timer = window.setInterval(tick, DAYLENGTH*1000);
}
function main() {
    startGame()
}

main()
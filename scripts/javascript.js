var request = new XMLHttpRequest();

request.open('GET', 'https://strainapi.evanbusse.com/OQSVRIt/strains/search/all', true);
request.onload = function() {
    var marias = JSON.parse(this.response);
    
    if (request.status >= 200 && request.status < 400) {
        for (var maria in marias) {
            var id = marias[maria].id;
            var nom = maria;
            var race = marias[maria].race;
            var flavors = marias[maria].flavors;
            var effects = marias[maria].effects;
            
            var strain = new Maria(id, nom, race, flavors, effects);
            arrayMarias.push(strain);
        }
        effectsAll();
        flavorsAll();
        
        fillSelects();
    }
}

request.send();


function Maria (id, nom, race, flavors, effects, desc) {
    this.id = id;
    this.nom = nom;
    this.race = race;
    this.flavors = flavors;
    this.effectsM = effects['medical'];
    this.effectsN = effects['negative'];
    this.effectsP = effects['positive'];
    this.effectsSum = this.effectsM.concat(this.effectsN.concat(this.effectsP));
    this.description = desc;
} 

var arrayMarias = new Array();
var arrayEffectsAll = new Array();
var arrayFlavorsAll = new Array();


function effectsAll() {   
    arrayMarias.forEach(maria => {
        maria.effectsSum.forEach(effect => {
            if (!arrayEffectsAll.includes(effect))
                arrayEffectsAll.push(effect);
        })
    })
}

function flavorsAll() {
    arrayMarias.forEach(maria => {
        maria.flavors.forEach(flavor => {
            if (!arrayFlavorsAll.includes(flavor))
                arrayFlavorsAll.push(flavor);
        })
    })
}

function fillSelects() {
    var selectEfecto = document.getElementById('selectEfecto');
    var selectSabor = document.getElementById('selectSabor');

    arrayEffectsAll.forEach(effect => {
        var opt = document.createElement('option');        
        opt.value = effect;
        opt.text = effect.toUpperCase();

        selectEfecto.add(opt);
    });

    arrayFlavorsAll.forEach(flavor => {
        var opt = document.createElement('option');        
        opt.value = flavor;
        opt.text = flavor.toUpperCase();

        selectSabor.add(opt);
    });
}

var arrayMariasSearch = new Array();
function searchMarias() {
    var selectEfecto = document.getElementById('selectEfecto').value;
    var selectSabor = document.getElementById('selectSabor').value; 

    arrayMariasSearch = [];

    for (let i = 0; i < arrayMarias.length; i++) {
        if (arrayMarias[i].flavors.indexOf(selectSabor) >= 0 && arrayMarias[i].effectsSum.indexOf(selectEfecto) >= 0)
            arrayMariasSearch.push(arrayMarias[i]);
    }
}

function clickButtonSearch() {
    var selectEfecto = document.getElementById('selectEfecto').value;
    var selectSabor = document.getElementById('selectSabor').value; 

    if (selectEfecto == null || selectSabor == null)
        alert('SELECT ONE FLAVOR AND ONE EFFECT PLEASE');
    else {
        searchMarias();
        generateDescMarias();
        generateCardsMarias();
    }
}

function generateDescMarias() {
    var xhr = [], i;
    for(i = 0; i < arrayMariasSearch.length; i++){ //for loop
        (function(i){
            xhr[i] = new XMLHttpRequest();
            url = 'https://strainapi.evanbusse.com/OQSVRIt/strains/data/desc/' + arrayMariasSearch[i].id;
            xhr[i].open("GET", url, true);
            xhr[i].onreadystatechange = function(){
                if (xhr[i].readyState === 4 && xhr[i].status === 200){
                    var descMaria = JSON.parse(xhr[i].response);
                    arrayMariasSearch[i].description = descMaria.desc;
                }
            };
            xhr[i].send();
        })(i);
    }

    console.log(arrayMariasSearch);
}

function generateCardsMarias() {
    console.log('generateCardsMarias function', arrayMariasSearch);
    for(let i = 0; i < arrayMariasSearch.length; i++) {
        var title = arrayMariasSearch[i].nom.toUpperCase();
        var race = arrayMariasSearch[i].race.toUpperCase();
        var desc = arrayMariasSearch[i].description;

        var card = document.createElement('div');
        card.classList.add('card');
        
        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        var h5 = document.createElement('h5');
        h5.classList.add('card-title');
        h5.textContent = title;

        var h6 = document.createElement('h6');
        h6.classList.add('card-subtitle');
        h6.classList.add('mb-2');
        h6.classList.add('text-muted');
        h6.textContent = race;

        var p = document.createElement('p');
        p.classList.add('card-text');
        p.textContent = desc;

        cardBody.appendChild(h5);
        cardBody.appendChild(h6);
        cardBody.appendChild(p);

        card.appendChild(cardBody);

        document.getElementById('divCards').appendChild(card);
    }
}
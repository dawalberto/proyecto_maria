var request = new XMLHttpRequest();

request.open('GET', 'http://strainapi.evanbusse.com/OQSVRIt/strains/search/all', true);
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


function Maria (id, nom, race, flavors, effects) {
    this.id = id;
    this.nom = nom;
    this.race = race;
    this.flavors = flavors;
    this.effectsM = effects['medical'];
    this.effectsN = effects['negative'];
    this.effectsP = effects['positive'];
    this.effectsSum = this.effectsM.concat(this.effectsN.concat(this.effectsP));
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
};

function flavorsAll() {
    arrayMarias.forEach(maria => {
        maria.flavors.forEach(flavor => {
            if (!arrayFlavorsAll.includes(flavor))
                arrayFlavorsAll.push(flavor);
        })
    })
};

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
};
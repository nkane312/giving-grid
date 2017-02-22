var mongoose = require('mongoose');
var GridSchema = require('./src/schemas/grid');

function setChances(spread, total){
    spread = spread.map(function(item, index) {
        item.chance = item.quantity / total;
        return item;
    });
    spread.sort(function(a, b){
        return a.chance - b.chance;
    });
    spread.forEach(function(item, i){
        if (i > 0 && i < spread.length - 1){
            item.chance += spread[i-1].chance;
        }
        else if (i === spread.length - 1) {
            item.chance = 1;
        }
    });
    return spread;
}

const spread = [
    {value: 25, quantity: 40, chance: undefined},
    {value: 35, quantity: 60, chance: undefined},
    {value: 50, quantity: 20, chance: undefined},
    {value: 75, quantity: 10, chance: undefined},
    {value: 100, quantity: 10, chance: undefined},
    {value: 125, quantity: 20, chance: undefined},
    {value: 150, quantity: 9, chance: undefined},
    {value: 350, quantity: 11, chance: undefined},
    {value: 700, quantity: 14, chance: undefined},
    {value: 1050, quantity: 1, chance: undefined},
    {value: 1400, quantity: 4, chance: undefined},
    {value: 5000, quantity: 1, chance: undefined}
];

function pickIndex(spread){
    var ran = Math.random();
    for(let i = 0; i < spread.length; i++){
        if (i === 0){
            if (ran <= spread[i].chance){
                return i;
            }
        }
        else if (i < spread.length - 1){
            if (ran <= spread[i].chance && ran > spread[i-1].chance){
                return i;
            }
        }
        else {
            return i;
        }
    }
}

function generateCells(spread){
    let cellQuantity = spread.reduce(function(a, b){
        return a + b.quantity;
    }, 0);

    let cells = [];

    while(cellQuantity > 0){
        if (spread.length > 1) {
            spread = setChances(spread, cellQuantity);
            var pick = pickIndex(spread);
            spread[pick].quantity -= 1;
            cells.push({
                dollarValue: spread[pick].value,
                class: 'available'
            });
            if (spread[pick].quantity === 0) {
                spread.splice(pick, 1);
            }
            cellQuantity -= 1;
        }
        else {
            cells.push({
                dollarValue: spread[0].value,
                class: 'available'
            });
            cellQuantity -= 1;
        }
    }
    return cells;
};


var grid = new GridSchema({
    image: './assets/freedom-flight.jpg',
    dfId: 12345,
    lvlId: 123,
    campaign: 'WOE',
    version: 8,
    cells: generateCells(spread)
});

//console.log(grid);

mongoose.connect('mongodb://127.0.0.1:27020');
grid.save(function(err){
    if(err){
        console.log(err);
    }
    else {
        console.log('Saved new grid');
    }
});

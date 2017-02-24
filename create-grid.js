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
    {value: 25, quantity: 41, chance: undefined},
    {value: 35, quantity: 59, chance: undefined},
    {value: 52, quantity: 20, chance: undefined},
    {value: 55, quantity: 1, chance: undefined},
    {value: 75, quantity: 9, chance: undefined},
    {value: 100, quantity: 10, chance: undefined},
    {value: 350, quantity: 40, chance: undefined},
    {value: 700, quantity: 16, chance: undefined},
    {value: 995, quantity: 4, chance: undefined},
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
    dfId: 13044,
    lvlId: 19329,
    headline: 'Give Together!',
    description: 'Freedom Flight now boarding! Click on one or more giving amounts and fill out your donation details below to join hundreds of Christians and Jews in rescuing 350 Jews from areas of distress around the world. As the worldwide <em>Fellowship</em> community bands together to send the next Freedom Flight home to Israel, giving squares will begin to reveal a special image to show the lifesaving impact of your support of the <em>On Wings of Eagles</em> ministry. <a href="https://secure.ifcj.org/site/Donation2?df_id=13044&13044.donation=form1&mfc_pref=T">You can also give using our standard donation form here</a>.',
    campaign: 'WOE',
    version: 1,
    cells: generateCells(spread)
});

//console.log(grid);
mongoose.connect('mongodb://express:SnailFail!2017@ds161109.mlab.com:61109/giving-grid');
//mongoose.connect('mongodb://127.0.0.1:27020');
grid.save(function(err){
    if(err){
        console.log(err);
        process.exit(1);
    }
    else {
        console.log('Saved new grid');
        process.exit(0);
    }
});

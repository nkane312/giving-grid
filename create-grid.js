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
    {value: 1000, quantity: 125, chance: undefined},
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
    image: './assets/rambam-14508714.jpg',
    dfId: 13304,
    lvlId: 19671,
    headline: 'A Lifesaving Opportunity!',
    description: '<em>The Fellowship</em> is blessed to extend an <u>exclusive invitation</u> to take part in a truly lifesaving project to help build the command center of Rambam Hospital, a fortified underground emergency center in Israel!  Because of your support, Rambam Hospital will sustain critical medical services and save lives in the wake of a terrorist attack, war, or natural disaster.<br><br>Click on one or more squares and fill out your donation details below to support this critical project. As the worldwide <em>Fellowship</em> community bands together to, giving blocks will begin to reveal a special image to show the impact of your support. To thank you for your gift of $1000 or more, your name will be featured on a plaque at Rambam to honor you for your sacrifice to save lives. <a href="https://secure.ifcj.org/site/Donation2?df_id=13044&13044.donation=form1&mfc_pref=T&subsrc=EA11707XXEXXM">You can also give using our standard donation form here</a>.',
    campaign: 'goi',
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

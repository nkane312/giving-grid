var mongoose = require('mongoose');
var GridSchema = require('./src/schemas/grid');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const spread = [
    {value: 25, quantity: 100},
    {value: 50, quantity: 50},
    {value: 100, quantity: 50}
];

function generateCells(spread){
    let cellQuantity = spread.reduce(function(a, b){
        return a + b.quantity;
    }, 0);

    let cells = [];
    while(cellQuantity > 0){
        let index = getRandomInt(0, spread.length);
        
        spread[index].quantity -= 1;
        cells.push({
            dollarValue: spread[index].value,
            class: 'available'
        });
        if (spread[index].quantity === 0){
            spread.splice(index, 1);
        }
        
        cellQuantity -= 1;
    }
    return cells;
};



var grid = new GridSchema({
    image: './assets/freedom-flight.jpg',
    dfId: 12345,
    campaign: 'WOE',
    version: 2,
    cells: generateCells(spread)
});

console.log(grid);

mongoose.connect('mongodb://127.0.0.1:27020');
grid.save(function(err){
    if(err){
        console.log(err);
    }
    else {
        console.log('Saved new grid');
    }
});

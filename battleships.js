"use strict";

var view = {

    displayMessage: function(msg) {
        var message = document.getElementById("message");
        message.innerHTML = msg;
    },

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
        cell.innerHTML = "hit!";
        view.displayMessage("hit!");
    },

    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
        cell.innerHTML = "miss";
        view.displayMessage("miss!");
    }

};


var model = {

    boardSize: 8,
    numberOfShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    
    ships : [

        {
            locations: ["0", "0", "0"],
            hits: ["", "", ""]
        },

        {
            locations: ["0", "0", "0"],
            hits: ["", "", ""]
        },

        {
            locations: ["0", "0", "0"],
            hits: ["", "", ""]
        }

    ],

    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numberOfShips; i++) {
            do {
                locations = this.generateShip();
                console.log(locations);
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var possibleStartLocation = ["a", "b", "c", "d", "e", "f", "g", "h"];
        var row = Math.floor(Math.random() * 8);
        var col = Math.floor(Math.random() * (9 - this.shipLength));

        // direction = 0;

        // if direction = 0 - make a vertical placed ship; if direction = 1 - make a horizontal placed ship

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(possibleStartLocation[row] + (col + 1));
                col++;
                // console.log(newShipLocations);
            } else {
                newShipLocations.push(possibleStartLocation[col] + (row + 1));
                col++;
                // console.log(newShipLocations);
            }
        }

        return newShipLocations;
    },

    collision: function(locations) {
        for (var i = 0; i < this.numberOfShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
    
    fire : function (guess) {

        //each iteration is checking for each existing battleship
        for (var i = 0; i < this.numberOfShips; i++) {

            //each iteration is checking for each battleship's part
            for (var j = 0; j < this.shipLength; j++){

                if (this.ships[i].locations[j] == guess){
                    this.ships[i].hits[j] = "hit!";
                    view.displayHit (guess);
                    view.displayMessage("hit!");

                    if (this.isSunk(this.ships[i])){
                        view.displayMessage("you sank my battleship!");
                        this.shipsSunk++;
                    }

                    return true;
                }

            }

        }

        view.displayMiss(guess);
        view.displayMessage("miss :(");

        return false;

    },

    isSunk: function(ship) {


        for (var i = 0; i < this.shipLength; i++) {


            if (ship.hits[i] !== "hit!") {
                return false;
            }

        }

        return true;

    }

};

var controller = {

    guesses: 0,

    parseGuess : function (guess) {
            try {
                if (guess == guess.match(/[a-h]{1}[1-8]{1}/i)[0]){
                    this.guesses++;
                    return guess.toLowerCase();
                }
            }
            catch (guess){
                alert("please, enter a valid data!");
                return null;
            }
    },

    processGuess: function(guess) {
        var location = this.parseGuess(guess);

        if (location) {
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numberOfShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }

};

function handleFireButton() {
    // var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    return false;
}

function handleKeyPress(e) {
    // var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function init() {
    model.generateShipLocations();

    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

}

window.onload = init;
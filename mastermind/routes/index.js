/*jshint node: true */
// poniżej użylismy krótszej (niż na wykładzie) formy
// module.exports ==> exports
exports.index = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    //dzięki temu renderujemy strone index jesli nic nie zostanie wpisane
    res.render('index', {
        title: 'Mastermind'
    });
};

exports.play = function (req, res) {
    var newGame = function () {
        var i, data = [],
            puzzle = req.session.puzzle;
        for (i = 0; i < puzzle.size; i += 1) {
            data.push(Math.floor(Math.random() * puzzle.dim));
        }//do sesyjnej zmiennej dopisujemy data
        req.session.puzzle.data = data;
        
        console.log("Size: " + req.session.puzzle.size);
        console.log("puzzle: " + req.session.puzzle.data);
        
        if(req.session.puzzle.size < 1) {
            return {
                "retMsg": "Error, wrong size"
            };
        }
        else {
            return { ///tworzymy jsona
                "retMsg": "Success",
                "size": req.session.puzzle.size,
                "dim":  req.session.puzzle.dim,
                "max": req.session.puzzle.max
            };
        }
        
    };
    // poniższa linijka jest zbędna (przy założeniu, że
    // play zawsze używany będzie po index) – w końcowym
    // rozwiązaniu można ją usunąć.
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    /*
     * req.params[2] === wartość size
     * req.params[4] === wartość dim
     * req.params[6] === wartość max
     */
    if (req.params[2]) {
        req.session.puzzle.size = req.params[2];
    }
    if (req.params[4]) {
        req.session.puzzle.dim = req.params[4];
    }
    if (req.params[6]) {  
        req.session.puzzle.max = req.params[6];
    }
    res.json(newGame());
};

exports.mark = function (req, res) {
    var markAnswer = function () {
        var puzzle = req.session.puzzle.data;
        var move = req.params[0].split('/');
        move = move.slice(0, move.length - 1);
        
        var answerNr = 0;
        var answer = []; //tablica kolorów
        var marked = []; //tablica sprawdzonych
        //1 krok
        for (i=0; i<move.length; i++) {
            if (puzzle[i] == move[i]) {
                answer[answerNr++] = 'c';
                marked[i] = 1;
            }
        }
        //2 krok
        for (i=0; i<move.length; i++) {
            if (marked[i] != 1) {
                for (j=0; j<puzzle.length; j++) {
                    if (marked[j] != 1) {
                        if (move[i] == puzzle[j]) {
                            answer[answerNr++] = 'b';
                        }
                    }
                }
            }
        }
        
        console.log(move);
        
        var goodAnswerCount = 0;
        for (i=0;i<answer.length;i++) {
            if (answer[i] == 'c') {
                goodAnswerCount++;
            }
        }
        
        if (goodAnswerCount == req.session.puzzle.size) {
            return {
                "retVal": answer,
                "retMsg": "Brawo, odgadłeś!"
            };
        }
        else {
            return {
                "retVal": answer,
                "retMsg": "Próbuj dalej"
            };
        }
        
    };
    res.json(markAnswer());
};

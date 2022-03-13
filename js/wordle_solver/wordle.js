class Wordle {
    constructor(is_hard_mode=false) {
        this.init(is_hard_mode)
    }

    get valid_guesses() {
        if (this.is_hard_mode) {
            const valid_guesses = this.valid_solutions
            return valid_guesses
        }
        const valid_guesses = words
        return valid_guesses
    }

    init(is_hard_mode=false) {
        this.valid_solutions = words
        this.is_hard_mode = is_hard_mode
    }

    enter(guess, status) {
        this.valid_solutions = this.#get_valid_solutions(guess, status)
    }

    #get_valid_solutions(guess, status) {
        const valid_solutions = []
        this.valid_solutions.forEach(valid_solution => {
            if (WordleUtilities.get_status(guess, valid_solution) !== status) {
                return
            }
            valid_solutions.push(valid_solution)
        })
        return valid_solutions
    }
}


class WordleUtilities {
    static get_status(guess, solution) {
        let status = ''
        for (let i = 0; i < Math.min(guess.length, solution.length); i++) {
            if (solution.includes(guess[i])) {
                if (guess[i] === solution[i]) {
                    status += '0'
                }
                else {
                    status += '1'
                }
            }
            else {
                status += '2'
            }
        }
        return status
    }
};
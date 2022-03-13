class Wordle {
    constructor(is_hard_mode=false) {
        this.initialize(is_hard_mode)
    }

    get valid_guesses() {
        if (this.is_hard_mode) {
            const valid_guesses = this.valid_solutions
            return valid_guesses
        }
        const valid_guesses = words
        return valid_guesses
    }

    initialize(is_hard_mode=false) {
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
        let status = ' '.repeat(guess.length)
        const solution_characters = {}
        for (let i = 0; i < solution.length; i++) {
            if (!(solution[i] in solution_characters)) {
                solution_characters[solution[i]] = 1
                continue
            }
            solution_characters[solution[i]]++
        }
        for (let i = 0; i < guess.length; i++) {
            if (!(guess[i] in solution_characters) || solution_characters[guess[i]] === 0) {
                continue
            }
            if (guess[i] !== solution[i]) {
                continue
            }
            status = status.substring(0, i) + '0' + status.substring(i + 1)
            solution_characters[guess[i]]--
        }
        for (let i = 0; i < guess.length; i++) {
            if (status[i] === '0') {
                continue
            }
            if (!(guess[i] in solution_characters) || solution_characters[guess[i]] === 0) {
                status = status.substring(0, i) + '2' + status.substring(i + 1)
                continue
            }
            if (guess[i] !== solution[i]) {
                status = status.substring(0, i) + '1' + status.substring(i + 1)
                solution_characters[guess[i]]--
            }
        }
        return status
    }
}
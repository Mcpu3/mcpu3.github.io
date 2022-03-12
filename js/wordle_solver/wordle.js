class Wordle {
    constructor(hard_mode=false) {
        this.words = words
        this.is_hard_mode = hard_mode
        this.valid_solutions = this.words
    }

    get valid_guesses() {
        if (this.is_hard_mode) {
            return this.valid_solutions
        }
        return this.words
    }

    init(is_hard_mode=false) {
        this.words = words
        this.is_hard_mode = is_hard_mode
        this.valid_solutions = this.words
    }

    enter(guess, status) {
        this.valid_solutions = this.#get_valid_solutions(guess, status)
    }

    get_status(guess, solution) {
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

    #get_valid_solutions(guess, status) {
        const valid_solutions = []
        this.valid_solutions.forEach(valid_solution => {
            if (this.get_status(guess, valid_solution) === status) {
                valid_solutions.push(valid_solution)
            }
        })
        return valid_solutions
    }
}
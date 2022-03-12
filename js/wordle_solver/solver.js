class Solver {
    constructor(wordle) {
        this.guess = 'tares'
        this.wordle = wordle
    }

    init() {
        this.guess = 'tares'
        this.wordle.init()
    }

    solve(status) {
        this.wordle.enter(this.guess, status)
        this.guess = this.#get_guess()
    }

    resolve() {
        this.guess = this.#get_guess()
    }

    #get_guess() {
        let guess = undefined;
        if (this.wordle.valid_solutions.length > 0) {
            if (this.wordle.valid_solutions.length > 1) {
                const guesses = this.#get_sorted_guesses_by_entropy()
                guess = guesses[Math.floor((Math.min(guesses.length, 10) - 1) * Math.random())]
            }
            else {
                guess = this.wordle.valid_solutions[0]
            }
        }
        return guess
    }

    #get_sorted_guesses_by_entropy() {
        const guesses = []
        const guesses_and_entropies = []
        this.wordle.valid_guesses.forEach(valid_guess => {
            guesses_and_entropies.push([valid_guess, this.#get_entropy(valid_guess)])
        })
        guesses_and_entropies.sort((a, b) => {
            return b[1] - a[1]
        })
        guesses_and_entropies.forEach(guess_and_entropy => {
            guesses.push(guess_and_entropy[0])
        })
        return guesses
    }

    #get_entropy(guess) {
        const statuses = {}
        this.wordle.valid_solutions.forEach(valid_solution => {
            const result = this.wordle.get_status(guess, valid_solution)
            if (!(result in statuses)) {
                statuses[result] = 1
            }
            else {
                statuses[result] += 1
            }
        })
        const e = []
        Object.values(statuses).forEach(p => {
            e.push(p * Math.log2(p))
        })
        const entropy = -e.reduce((previous_value, current_value) => previous_value + current_value, 0)
        return entropy
    }
};
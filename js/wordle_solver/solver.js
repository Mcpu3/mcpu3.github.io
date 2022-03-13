class Solver {
    constructor(wordle) {
        this.wordle = wordle
        this.init()
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
        if (this.wordle.valid_solutions.length === 0) {
            const guess = undefined
            return guess
        }
        if (this.wordle.valid_solutions.length === 1) {
            const guess = this.wordle.valid_solutions[0]
            return guess
        }
        const guesses = this.#get_sorted_guesses_by_entropy()
        const guess = guesses[Math.floor((Math.min(guesses.length, 10) - 1) * Math.random())]
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
            const status = WordleUtilities.get_status(guess, valid_solution)
            if (!(status in statuses)) {
                statuses[status] = 1
                return
            }
            statuses[status] += 1
        })
        const e = []
        Object.values(statuses).forEach(p => {
            e.push(p * Math.log2(p))
        })
        const entropy = -e.reduce((previous_value, current_value) => previous_value + current_value, 0)
        return entropy
    }
};
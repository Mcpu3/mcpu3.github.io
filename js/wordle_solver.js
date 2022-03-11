function main() {
    const wordle = new Wordle()
    const solver = new Solver(wordle)
    const wordle_solver = new WordleSolver(solver)
}


class WordleSolver {
    constructor(solver) {
        this._guess = 'tares'
        this._solver = solver
        this.#init_ui()
        this.#add_event_listeners()
    }

    set guess(guess) {
        this._guess = guess
    }

    set solver(solver) {
        this._solver = solver
    }

    get guess() {
        return this._guess
    }

    get solver() {
        return this._solver
    }

    #add_event_listeners() {
        document.getElementById('solve').addEventListener('click', (event) => {
            this.solve()
        })
        document.getElementById('resolve').addEventListener('click', (event) => {
            this.resolve()
        })
        document.getElementById('reset').addEventListener('click', (event) => {
            this.reset()
        })
        document.getElementById('hard_mode').addEventListener('change', (event) => {
            this._solver.wordle.hard_mode = false
            if (event.target.checked) {
                this._solver.wordle.hard_mode = true
            }
        })
    }

    init() {
        this._guess = 'tares'
        this._solver.init()
        this.#init_ui()
    }

    solve() {
        const result = document.getElementById('result').value.toString()
        if (this.#foolproof_of_result(result)) {
            this._solver.wordle.submit(this._guess, result)
            const guess = this._solver.solve()
            this._guess = guess
            this.#init_ui()
        }
    }

    #foolproof_of_result(result) {
        if (result.match(/[012]{5}/) && result.match(/[012]{5}/)[0] === result) {
            this.#set_input_color_of_result()
            return true
        }
        this.#set_input_color_of_result(true)
        return false
    }

    resolve() {
        const guess = this._solver.solve()
        this._guess = guess
        this.#init_ui()
    }

    reset() {
        this.init()
    }

    #init_ui() {
        document.getElementById('guess').innerText = ''
        if (this._guess) {
            document.getElementById('guess').innerText = this._guess.toUpperCase()
        }
        document.getElementById('result').value = ''
        this.#set_input_color_of_result()
        if (!this._solver.wordle.hard_mode) {
            document.getElementById('hard_mode').checked = false
        }
        else {
            document.getElementById('hard_mode').checked = true
        }
        document.getElementById('number_of_valid_corrects').innerText = this._solver.wordle.valid_corrects.length
    }

    #set_input_color_of_result(is_danger=false) {
        document.getElementById('result').className = 'input'
        document.getElementById('result_help').className = 'help'
        if (is_danger) {
            document.getElementById('result').className = 'input is-danger'
            document.getElementById('result_help').className = 'help is-danger'
        }
    }
}


class Solver {
    constructor(wordle) {
        this._wordle = wordle
    }

    set wordle(wordle) {
        this._wordle = wordle
    }

    get wordle() {
        return this._wordle
    }

    init() {
        this._wordle.init()
    }

    solve() {
        let guess = undefined;
        if (this._wordle.valid_corrects.length > 0) {
            if (this._wordle.valid_corrects.length > 1) {
                const guesses = this.#calculate_sorted_guesses_by_entropy()
                guess = guesses[Math.floor((Math.min(guesses.length, 10) - 1) * Math.random())]
            }
            else {
                guess = this._wordle.valid_corrects[0]
            }
        }
        return guess
    }

    #calculate_sorted_guesses_by_entropy() {
        const guesses = []
        const guesses_and_entropies = []
        this._wordle.valid_guesses.forEach(valid_guess => {
            guesses_and_entropies.push([valid_guess, this.#calculate_entropy(valid_guess)])
        })
        guesses_and_entropies.sort((a, b) => {
            return b[1] - a[1]
        })
        guesses_and_entropies.forEach(guess_and_entropy => {
            guesses.push(guess_and_entropy[0])
        })
        return guesses
    }

    #calculate_entropy(guess) {
        const results = {}
        this._wordle.valid_corrects.forEach(valid_correct => {
            const result = this._wordle.judge(guess, valid_correct)
            if (!(result in results)) {
                results[result] = 1
            }
            else {
                results[result] += 1
            }
        })
        const e = []
        Object.values(results).forEach(p => {
            e.push(p * Math.log2(p))
        })
        const entropy = -e.reduce((previous_value, current_value) => previous_value + current_value, 0)
        return entropy
    }
};


class Wordle {
    constructor(hard_mode=false) {
        this._words = words
        this._hard_mode = hard_mode
        this._valid_guesses = this._words
        this._valid_corrects = this._words
    }

    set words(words) {
        this._words = words
    }

    set hard_mode(hard_mode) {
        this._hard_mode = hard_mode
    }

    set valid_guesses(valid_guesses) {
        if (!hard_mode) {
            this._valid_guesses = valid_guesses
        }
        else {
            this._valid_corrects = valid_guesses
        }
    }

    set valid_corrects(valid_corrects) {
        this._valid_corrects = valid_corrects
    }

    get words() {
        return this._words
    }

    get hard_mode() {
        return this._hard_mode
    }

    get valid_guesses() {
        if (!hard_mode) {
            return this._valid_guesses
        }
        return this._valid_corrects
    }

    get valid_corrects() {
        return this._valid_corrects
    }

    init(hard_mode=false) {
        this._words = words
        this._hard_mode = hard_mode
        this._valid_guesses = this._words
        this.valid_corrects = this._words
    }

    submit(guess, result) {
        this.#update_valid_guesses(guess)
        this.#update_valid_corrects(guess, result)
    }

    judge(guess, correct) {
        let result = ''
        for (let i = 0; i < Math.min(guess.length, correct.length); i++) {
            if (correct.includes(guess[i])) {
                if (guess[i] === correct[i]) {
                    result += '0'
                }
                else {
                    result += '1'
                }
            }
            else {
                result += '2'
            }
        }
        return result
    }

    #update_valid_guesses(guess) {
        const valid_guesses = []
        this._valid_guesses.forEach(valid_guess => {
            if (valid_guess !== guess) {
                valid_guesses.push(valid_guess)
            }
        })
        this._valid_guesses = valid_guesses
    }

    #update_valid_corrects(guess, result) {
        const valid_corrects = []
        this._valid_corrects.forEach(valid_correct => {
            if (this.judge(guess, valid_correct) === result) {
                valid_corrects.push(valid_correct)
            }
        })
        this._valid_corrects = valid_corrects
    }
}


main()
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
        this.#add_event_listeners_of_solve()
        this.#add_event_listeners_of_guess()
        this.#add_event_listeners_of_hard_mode()
        this.#add_event_listeners_of_reset()
    }

    #add_event_listeners_of_solve() {
        document.getElementById('button_of_solve').addEventListener('click', (event) => {
            this.solve()
        })
        document.getElementById('button_of_resolve').addEventListener('click', (event) => {
            this.resolve()
        })
    }

    #add_event_listeners_of_guess() {
        document.getElementById('button_of_edit_of_edit_guess').addEventListener('click', (event) => {
            this.edit_guess()
        })
        document.getElementById('button_of_edit_guess').addEventListener('click', (event) => {
            this.#set_edit_guess(true)
        })
        document.getElementById('button_of_cancel_of_edit_guess').addEventListener('click', (event) => {
            this.#init_ui_of_guess()
        })
    }

    #add_event_listeners_of_hard_mode() {
        document.getElementById('switch_of_hard_mode').addEventListener('change', (event) => {
            this._solver.wordle.hard_mode = false
            if (event.target.checked) {
                this._solver.wordle.hard_mode = true
            }
        })
    }

    #add_event_listeners_of_reset() {
        document.getElementById('button_of_reset').addEventListener('click', (event) => {
            this.reset()
        })
    }

    init() {
        this._guess = 'tares'
        this._solver.init()
        this.#init_ui()
    }

    solve() {
        const result = document.getElementById('text_input_of_result').value.toString()
        if (this.#foolproof_of_result(result)) {
            this.#set_button_state_of_solve(true)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this._solver.wordle.submit(this._guess, result)
                    const guess = this._solver.solve()
                    this._guess = guess
                    this.#init_ui()
                })
            })
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
        this.#set_button_state_of_resolve(true)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const guess = this._solver.solve()
                this._guess = guess
                this.#init_ui()
            })
        })
    }

    edit_guess() {
        const guess = document.getElementById('text_input_of_guess_of_edit_guess').value
        if (this.#foolproof_of_guess(guess.toLowerCase())) {
            this._guess = guess.toLowerCase()
            this.#init_ui_of_guess()
        }
    }

    #foolproof_of_guess(guess) {
        if (this._solver.wordle.words.includes(guess)) {
            this.#set_input_color_of_guess()
            return true
        }
        this.#set_input_color_of_guess(true)
        return false
    }

    reset() {
        this.init()
    }

    #init_ui() {
        this.#init_ui_of_solve()
        this.#init_ui_of_guess()
        this.#init_ui_of_result()
        this.#init_ui_of_hard_mode()
        this.#init_ui_of_number_of_candidates_of_result()
    }

    #init_ui_of_solve() {
        this.#set_button_state_of_solve()
        this.#set_button_state_of_resolve()
    }

    #set_button_state_of_solve(is_loading=false) {
        document.getElementById('button_of_solve').className = 'button is-primary'
        if (is_loading) {
            document.getElementById('button_of_solve').className = 'button is-primary is-loading'
        }
    }

    #set_button_state_of_resolve(is_loading=false) {
        document.getElementById('button_of_resolve').className = 'button'
        if (is_loading) {
            document.getElementById('button_of_resolve').className = 'button is-loading'
        }
    }

    #init_ui_of_guess() {
        document.getElementById('guess').innerText = ''
        if (this._guess) {
            document.getElementById('guess').innerText = this._guess.toUpperCase()
        }
        document.getElementById('text_input_of_guess_of_edit_guess').value = ''
        this.#set_input_color_of_guess()
        this.#set_edit_guess()
    }

    #set_input_color_of_guess(is_danger=false) {
        document.getElementById('text_input_of_guess_of_edit_guess').className = 'input'
        if (is_danger) {
            document.getElementById('text_input_of_guess_of_edit_guess').className = 'input is-danger'
        }
    }

    #set_edit_guess(editing_guess=false) {
        document.getElementById('button_of_edit_guess').style.display = ''
        document.getElementById('field_of_edit_guess').style.display = 'none'
        if (editing_guess) {
            document.getElementById('button_of_edit_guess').style.display = 'none'
            document.getElementById('field_of_edit_guess').style.display = ''
        }
    }

    #init_ui_of_result() {
        document.getElementById('text_input_of_result').value = ''
        this.#set_input_color_of_result()
    }

    #set_input_color_of_result(is_danger=false) {
        document.getElementById('text_input_of_result').className = 'input'
        document.getElementById('help_of_result').className = 'help'
        if (is_danger) {
            document.getElementById('text_input_of_result').className = 'input is-danger'
            document.getElementById('help_of_result').className = 'help is-danger'
        }
    }

    #init_ui_of_hard_mode() {
        if (!this._solver.wordle.hard_mode) {
            document.getElementById('switch_of_hard_mode').checked = false
        }
        else {
            document.getElementById('switch_of_hard_mode').checked = true
        }
    }

    #init_ui_of_number_of_candidates_of_result() {
        document.getElementById('number_of_candidates_of_result').innerText = this._solver.wordle.valid_corrects.length
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
        if (!this._hard_mode) {
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
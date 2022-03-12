class WordleSolver {
    constructor(solver) {
        this.solver = solver
        this.#add_event_listeners()
        this.#init_ui()
    }

    init() {
        this.solver.init()
        this.#init_ui()
    }

    #add_event_listeners() {
        this.#add_event_listeners_of_hard_mode()
        this.#add_event_listeners_of_changing_guess()
        this.#add_event_listeners_of_solve()
        this.#add_event_listeners_of_resolve()
        this.#add_event_listeners_of_reset()
    }

    #add_event_listeners_of_hard_mode() {
        document.getElementById('hard_mode').addEventListener('change', (event) => {
            if (event.target.checked) {
                this.solver.wordle.is_hard_mode = true
                return
            }
            this.solver.wordle.is_hard_mode = false
        })
    }

    #add_event_listeners_of_changing_guess() {
        document.getElementById('display_changing_guess').addEventListener('click', (event) => {
            this.#set_displaying_of_changing_guess(true)
        })
        document.getElementById('change_of_changing_guess').addEventListener('click', (event) => {
            const guess = document.getElementById('guess_of_changing_guess').value
            if (!this.#foolproof_of_guess(guess.toLowerCase())) {
                this.#set_color_of_guess_of_changing_guess(true)
                return
            }
            this.solver.guess = guess.toLowerCase()
            this.#init_ui_of_guess()
            this.#init_ui_of_changing_guess()
        })
        document.getElementById('cancel_of_changing_guess').addEventListener('click', (event) => {
            this.#init_ui_of_changing_guess()
        })
    }

    #add_event_listeners_of_solve() {
        document.getElementById('solve').addEventListener('click', (event) => {
            const status = document.getElementById('status').value.toString()
            if (!this.#foolproof_of_status(status)) {
                this.#set_color_of_status(true)
                return
            }
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.solver.solve(status)
                    this.#init_ui_of_valid_solutions()
                    this.#init_ui_of_guess()
                    this.#init_ui_of_status()
                    this.#init_ui_of_solve()
                })
            })
        })
    }

    #add_event_listeners_of_resolve() {
        document.getElementById('resolve').addEventListener('click', (event) => {
            this.#set_state_of_resolve(true)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.solver.resolve()
                    this.#init_ui_of_guess()
                    this.#init_ui_of_resolve()
                })
            })
        })
    }

    #add_event_listeners_of_reset() {
        document.getElementById('reset').addEventListener('click', (event) => {
            this.init()
        })
    }

    #init_ui() {
        this.#init_ui_of_hard_mode()
        this.#init_ui_of_valid_solutions()
        this.#init_ui_of_guess()
        this.#init_ui_of_changing_guess()
        this.#init_ui_of_status()
        this.#init_ui_of_solve()
        this.#init_ui_of_resolve()
    }

    #init_ui_of_hard_mode() {
        if (this.solver.wordle.is_hard_mode) {
            document.getElementById('hard_mode').checked = true
            return
        }
        document.getElementById('hard_mode').checked = false
    }

    #init_ui_of_valid_solutions() {
        document.getElementById('valid_solutions').innerText = this.solver.wordle.valid_solutions.length
    }

    #init_ui_of_guess() {
        if (!this.solver.guess) {
            document.getElementById('guess').innerText = ''
            return
        }
        document.getElementById('guess').innerText = this.solver.guess.toUpperCase()
    }

    #init_ui_of_changing_guess() {
        document.getElementById('guess_of_changing_guess').value = ''
        this.#set_displaying_of_changing_guess()
        this.#set_color_of_guess_of_changing_guess()
    }

    #init_ui_of_status() {
        document.getElementById('status').value = ''
        this.#set_color_of_status()
    }

    #init_ui_of_solve() {
        this.#set_state_of_solve()
    }

    #init_ui_of_resolve() {
        this.#set_state_of_resolve()
    }

    #set_displaying_of_changing_guess(has_display=false) {
        if (has_display) {
            document.getElementById('display_changing_guess').style.display = 'none'
            document.getElementById('changing_guess').style.display = ''
            return
        }
        document.getElementById('display_changing_guess').style.display = ''
        document.getElementById('changing_guess').style.display = 'none'
    }

    #set_color_of_guess_of_changing_guess(is_danger=false) {
        if (is_danger) {
            document.getElementById('guess_of_changing_guess').className = 'input is-danger'
            return
        }
        document.getElementById('guess_of_changing_guess').className = 'input'
    }

    #set_color_of_status(is_danger=false) {
        if (is_danger) {
            document.getElementById('status').className = 'input is-danger'
            document.getElementById('help_of_status').className = 'help is-danger'
            return
        }
        document.getElementById('status').className = 'input'
        document.getElementById('help_of_status').className = 'help'
    }

    #set_state_of_solve(is_loading=false) {
        if (is_loading) {
            document.getElementById('solve').className = 'button is-primary is-loading'
            return
        }
        document.getElementById('solve').className = 'button is-primary'
    }

    #set_state_of_resolve(is_loading=false) {
        if (is_loading) {
            document.getElementById('resolve').className = 'button is-loading'
            return
        }
        document.getElementById('resolve').className = 'button'
    }

    #foolproof_of_guess(guess) {
        if (!this.solver.wordle.valid_guesses.includes(guess)) {
            return false
        }
        return true
    }

    #foolproof_of_status(status) {
        if (!(status.match(/[012]{5}/) && status.match(/[012]{5}/)[0] === status)) {
            return false
        }
        return true
    }
}


const wordle = new Wordle()
const solver = new Solver(wordle)
const wordle_solver = new WordleSolver(solver)
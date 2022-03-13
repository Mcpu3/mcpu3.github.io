class WordleSolver {
    constructor(solver) {
        this.node = document.querySelector('.wordle_solver')
        this.solver = solver
        this.#add_event_listener()
        this.init()
    }

    init() {
        this.solver.init()
        this.#init_node()
    }

    #init_node() {
        this.#init_wordle_node()
        this.#init_solver_node()
        this.#init_reset_node()
    }

        #init_wordle_node() {
            this.#init_wordle_valid_solutions_node()
            this.#init_wordle_hard_mode_node()
        }

            #init_wordle_valid_solutions_node() {
                this.#init_wordle_valid_solutions_valid_solutions_node()
            }

                #init_wordle_valid_solutions_valid_solutions_node() {
                    const node = this.node.querySelector('.wordle').querySelector('.valid_solutions').querySelector('#valid_solutions')
                    node.innerText = this.solver.wordle.valid_solutions.length
                }

            #init_wordle_hard_mode_node() {
                this.#init_wordle_hard_mode_hard_mode_node()
            }

                #init_wordle_hard_mode_hard_mode_node() {
                    const node = this.node.querySelector('.wordle').querySelector('.hard_mode').querySelector('#hard_mode')
                    node.checked = this.solver.wordle.is_hard_mode
                }

        #init_solver_node() {
            this.#init_solver_guess_node()
            this.#init_solver_status_node()
            this.#init_solver_solve_resolve_node()
        }

            #init_solver_guess_node() {
                this.#init_solver_guess_guess_node()
                this.#init_solver_guess_change_node()
            }

                #init_solver_guess_guess_node() {
                    this.#init_solver_guess_guess_guess_node()
                }

                    #init_solver_guess_guess_guess_node() {
                        const node = this.node.querySelector('.solver').querySelector('.guess').querySelector('.guess').querySelector('#guess')
                        const guess = this.solver.guess
                        if (!guess) {
                            node.innerText = ''
                            return
                        }
                        node.innerText = guess.toUpperCase()
                    }

                #init_solver_guess_change_node() {
                    this.#init_solver_guess_change_guess_node()
                    this.#init_solver_guess_change_change_node()
                }

                    #init_solver_guess_change_guess_node() {
                        const node = this.node.querySelector('.solver').querySelector('.guess').querySelector('.change').querySelector('#guess')
                        node.value = ''
                        node.className = 'input'
                    }

                    #init_solver_guess_change_change_node() {
                        const node = this.node.querySelector('.solver').querySelector('.guess').querySelector('.change').querySelector('#change')
                    }

            #init_solver_status_node() {
                this.#init_solver_status_status_node()
                this.#init_solver_status_status_help_node()
            }

                #init_solver_status_status_node() {
                    const node = this.node.querySelector('.solver').querySelector('.status').querySelector('#status')
                    node.value = ''
                    node.className = 'input'
                }

                #init_solver_status_status_help_node() {
                    const node = this.node.querySelector('.solver').querySelector('.status').querySelector('#status_help')
                    node.className = 'help'
                }

            #init_solver_solve_resolve_node() {
                this.#init_solver_solve_resolve_solve_node()
                this.#init_solver_solve_resolve_resolve_node()
            }

                #init_solver_solve_resolve_solve_node() {
                    const node = this.node.querySelector('.solver').querySelector('.solve_resolve').querySelector('#solve')
                    node.className = 'button is-primary'
                }

                #init_solver_solve_resolve_resolve_node() {
                    const node = this.node.querySelector('.solver').querySelector('.solve_resolve').querySelector('#resolve')
                    node.className = 'button'
                }

        #init_reset_node() {
            this.#init_reset_reset_node()
        }

            #init_reset_reset_node() {
                const node = this.node.querySelector('.reset').querySelector('#reset')
            }

    #add_event_listener() {
        this.#add_wordle_event_listener()
        this.#add_solver_event_listener()
        this.#add_reset_event_listener()
    }

        #add_wordle_event_listener() {
            this.#add_wordle_valid_solutions_event_listener()
            this.#add_wordle_hard_mode_event_listener()
        }

            #add_wordle_valid_solutions_event_listener() {
                this.#add_wordle_valid_solutions_valid_solutions_event_listener()
            }

                #add_wordle_valid_solutions_valid_solutions_event_listener() {
                    const node = this.node.querySelector('.wordle').querySelector('.valid_solutions').querySelector('#valid_solutions')
                }

            #add_wordle_hard_mode_event_listener() {
                this.#add_wordle_hard_mode_hard_mode_event_listener()
            }

                #add_wordle_hard_mode_hard_mode_event_listener() {
                    const node = this.node.querySelector('.wordle').querySelector('.hard_mode').querySelector('#hard_mode')
                    node.addEventListener('change', (event) => {
                        this.solver.wordle.is_hard_mode = event.target.checked
                    })
                }

        #add_solver_event_listener() {
            this.#add_solver_guess_event_listener()
            this.#add_solver_status_event_listener()
            this.#add_solver_solve_resolve_event_listener()
        }

            #add_solver_guess_event_listener() {
                this.#add_solver_guess_guess_event_listener()
                this.#add_solver_guess_change_event_listener()
            }

                #add_solver_guess_guess_event_listener() {
                    const node = this.node.querySelector('.solver').querySelector('.guess').querySelector('#guess')
                }

                #add_solver_guess_change_event_listener() {
                    this.#add_solver_guess_change_guess_event_listener()
                    this.#add_solver_guess_change_change_event_listener()
                }

                    #add_solver_guess_change_guess_event_listener() {
                        const node = this.node.querySelector('.solver').querySelector('.guess').querySelector('.change').querySelector('#guess')
                    }

                    #add_solver_guess_change_change_event_listener() {
                        const node = this.node.querySelector('.solver').querySelector('.guess').querySelector('.change').querySelector('#change')
                        node.addEventListener('click', (event) => {
                            const guess = this.node.querySelector('.solver').querySelector('.guess').querySelector('.change').querySelector('#guess').value
                            if (!this.solver.wordle.valid_guesses.includes(guess)) {
                                this.node.querySelector('.solver').querySelector('.guess').querySelector('.change').querySelector('#guess').className = 'input is-danger'
                                return
                            }
                            this.solver.guess = guess
                            this.#init_solver_guess_node()
                        })
                    }

            #add_solver_status_event_listener() {
                this.#add_solver_status_status_event_listener()
                this.#add_solver_status_status_help_event_listener()
            }

                #add_solver_status_status_event_listener() {
                    const node = this.node.querySelector('.solver').querySelector('.status').querySelector('#status')
                }

                #add_solver_status_status_help_event_listener() {
                    const node = this.node.querySelector('.solver').querySelector('.status').querySelector('#status_help')
                }

            #add_solver_solve_resolve_event_listener() {
                this.#add_solver_solve_resolve_solve_event_listener()
                this.#add_solver_solve_resolve_resolve_event_listener()
            }

                #add_solver_solve_resolve_solve_event_listener() {
                    const node = this.node.querySelector('.solver').querySelector('.solve_resolve').querySelector('#solve')
                    node.addEventListener('click', (event) => {
                        const status = this.node.querySelector('.solver').querySelector('.status').querySelector('#status').value.toString()
                        if (!(status.match(new RegExp('[012]{' + this.solver.guess.length.toString() + '}')) && status.match(new RegExp('[012]{' + this.solver.guess.length.toString() + '}'))[0] === status)) {
                            this.node.querySelector('.solver').querySelector('.status').querySelector('#status').className = 'input is-danger'
                            this.node.querySelector('.solver').querySelector('.status').querySelector('#status_help').className = 'help is-danger'
                            return
                        }
                        event.target.className = 'button is-primary is-loading'
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                this.solver.solve(status)
                                this.#init_wordle_valid_solutions_node()
                                this.#init_solver_guess_guess_node()
                                this.#init_solver_status_node()
                                this.#init_solver_solve_resolve_solve_node()
                            })
                        })
                    })
                }

                #add_solver_solve_resolve_resolve_event_listener() {
                    const node = this.node.querySelector('.solver').querySelector('.solve_resolve').querySelector('#resolve')
                    node.addEventListener('click', (event) => {
                        node.className = 'button is-loading'
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                this.solver.resolve()
                                this.#init_wordle_valid_solutions_node()
                                this.#init_solver_guess_guess_node()
                                this.#init_solver_solve_resolve_resolve_node()
                            })
                        })
                    })
                }

        #add_reset_event_listener() {
            this.#add_reset_reset_event_listener()
        }

            #add_reset_reset_event_listener() {
                const node = this.node.querySelector('.reset').querySelector('#reset')
                node.addEventListener('click', (event) => {
                    this.init()
                })
            }
}


class InitializingNode {

}


const wordle = new Wordle()
const solver = new Solver(wordle)
const wordle_solver = new WordleSolver(solver)
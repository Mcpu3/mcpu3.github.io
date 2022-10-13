const wordle = new Wordle()
const wordle_solver = new WordleSolver(wordle)

document.getElementById('reset_button').addEventListener('click', (event) => {
    event.preventDefault()
    wordle_solver.initialize()
})

{
    {
        window.addEventListener('DOMContentLoaded', (event) => {
            document.getElementById('guess').innerText = wordle_solver.guess
        })

        document.getElementById('reset_button').addEventListener('click', (event) => {
            event.preventDefault()
            document.getElementById('guess').innerText = wordle_solver.guess
        })
    }

    {
        document.getElementById('change_button').addEventListener('click', (event) => {
            event.preventDefault()
            const guess = document.getElementById('guess_input').value.toLowerCase()
            if (!wordle_solver.wordle.valid_guesses.includes(guess)) {
                document.getElementById('guess_input').classList.add('is-danger')
                return
            }
            {
                wordle_solver.guess = guess
                document.getElementById('guess').innerText = wordle_solver.guess
            }
            document.getElementById('guess_input').value = ''
            document.getElementById('guess_input').classList.remove('is-danger')
        })

        document.getElementById('reset_button').addEventListener('click', (event) => {
            event.preventDefault()
            document.getElementById('guess_input').value = ''
            document.getElementById('guess_input').classList.remove('is-danger')
        })
    }

    {
        let status = ''

        document.getElementById('solve_button').addEventListener('click', (event) => {
            event.preventDefault()
            if (status.length !== wordle_solver.guess.length) {
                document.getElementById('status_input').classList.add('is-danger')
                return
            }
            document.getElementById('solve_button').classList.add('is-loading')
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    wordle_solver.solve(status)
                    {
                        document.getElementById('guess').innerText = wordle_solver.guess
                        {
                            document.getElementById('valid_solutions').innerText = wordle_solver.wordle.valid_solutions.length
                        }
                    }
                    status = ''
                    document.getElementById('status_input').value = ''
                    document.getElementById('status_input').classList.remove('is-danger')
                    document.getElementById('solve_button').classList.remove('is-loading')
                })
            })
        })

        document.getElementById('reset_button').addEventListener('click', (event) => {
            event.preventDefault()
            status = ''
            document.getElementById('status_input').value = ''
            document.getElementById('status_input').classList.remove('is-danger')
        })

        {
            document.getElementById('correct_button').addEventListener('click', (event) => {
                event.preventDefault()
                status += '1'
                document.getElementById('status_input').value += '🟩'
            })

            document.getElementById('present_button').addEventListener('click', (event) => {
                event.preventDefault()
                status += '2'
                document.getElementById('status_input').value += '🟨'
            })

            document.getElementById('absent_button').addEventListener('click', (event) => {
                event.preventDefault()
                status += '3'
                document.getElementById('status_input').value += '⬛'
            })

            document.getElementById('delete_button').addEventListener('click', (event) => {
                event.preventDefault()
                status = status.slice(0, -1)
                document.getElementById('status_input').value = ''
                for (let i = 0; i < status.length; i++) {
                    if (status[i] === '1') {
                        document.getElementById('status_input').value += '🟩'
                        continue
                    }
                    if (status[i] === '2') {
                        document.getElementById('status_input').value += '🟨'
                        continue
                    }
                    document.getElementById('status_input').value += '⬛'
                }
            })
        }
    }

    {
        document.getElementById('resolve_button').addEventListener('click', (event) => {
            event.preventDefault()
            document.getElementById('resolve_button').classList.add('is-loading')
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    wordle_solver.resolve()
                    {
                        document.getElementById('guess').innerText = wordle_solver.guess
                        {
                            document.getElementById('valid_solutions').innerText = wordle_solver.wordle.valid_solutions.length
                        }
                    }
                    document.getElementById('resolve_button').classList.remove('is-loading')
                })
            })
        })
    }

    {
        {
            window.addEventListener('DOMContentLoaded', (event) => {
                document.getElementById('valid_solutions').innerText = wordle_solver.wordle.valid_solutions.length
            })

            document.getElementById('reset_button').addEventListener('click', (event) => {
                event.preventDefault()
                document.getElementById('valid_solutions').innerText = wordle_solver.wordle.valid_solutions.length
            })
        }

        {
            window.addEventListener('DOMContentLoaded', (event) => {
                if (wordle_solver.wordle.is_hard_mode) {
                    document.getElementById('is_hard_mode_checkbox').checked = true
                    return
                }
                document.getElementById('is_hard_mode_checkbox').checked = false
            })

            document.getElementById('is_hard_mode_checkbox').addEventListener('change', (event) => {
                const is_hard_mode = document.getElementById('is_hard_mode_checkbox').checked
                wordle_solver.wordle.set_is_hard_mode(is_hard_mode)
            })

            document.getElementById('reset_button').addEventListener('click', (event) => {
                if (wordle_solver.wordle.is_hard_mode) {
                    document.getElementById('is_hard_mode_checkbox').checked = true
                    return
                }
                document.getElementById('is_hard_mode_checkbox').checked = false
            })
        }
    }
}
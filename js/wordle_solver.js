wordle = new Wordle()
wordle_solver = new WordleSolver(wordle)
let status = ''
document.getElementById('change_button').addEventListener('click', (event) => {
    event.preventDefault()
    const guess = document.getElementById('guess_input').value.toLowerCase()
    if (!wordle_solver.wordle.valid_guesses.includes(guess)) {
        document.getElementById('guess_input').classList.add('is-danger')
        return
    }
    wordle_solver.guess = guess
    document.getElementById('guess_input').value = ''
    document.getElementById('guess_input').classList.remove('is-danger')
})
document.getElementById('correct_button').addEventListener('click', (event) => {
    event.preventDefault()
    status += '1'
})
document.getElementById('present_button').addEventListener('click', (event) => {
    event.preventDefault()
    status += '2'
})
document.getElementById('absent_button').addEventListener('click', (event) => {
    event.preventDefault()
    status += '3'
})
document.getElementById('delete_button').addEventListener('click', (event) => {
    event.preventDefault()
    status = status.slice(0, -1)
})
document.getElementById('solve_button').addEventListener('click', (event) => {
    event.preventDefault()
    if (status.length !== wordle_solver.guess.length) {
        document.getElementById('status_input').classList.add('is-danger')
        return
    }
    event.target.classList.add('is-loading')
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            wordle_solver.solve(status)
            status = []
            document.getElementById('status_input').classList.remove('is-danger')
            event.target.classList.remove('is-loading')
        })
    })
})
document.getElementById('resolve_button').addEventListener('click', (event) => {
    event.preventDefault()
    event.target.classList.add('is-loading')
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            wordle_solver.resolve()
            event.target.classList.remove('is-loading')
        })
    })
})
document.getElementById('is_hard_mode_checkbox').addEventListener('change', (event) => {
    const is_hard_mode = event.target.checked
    wordle_solver.wordle.set_is_hard_mode(is_hard_mode)
})
document.getElementById('reset_button').addEventListener('click', (event) => {
    event.preventDefault()
    wordle_solver.initialize()
    status = []
    document.getElementById('guess_input').value = ''
    document.getElementById('guess_input').classList.remove('is-danger')
    document.getElementById('status_input').classList.remove('is-danger')
})
const update_guess = () => {
    requestAnimationFrame(() => {
        document.getElementById('guess').innerText = wordle_solver.guess
        requestAnimationFrame(update_guess)
    })
}
update_guess()
const update_status_input = () => {
    requestAnimationFrame(() => {
        requestAnimationFrame(update_status_input)
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
update_status_input()
const update_valid_solutions = () => {
    requestAnimationFrame(() => {
        requestAnimationFrame(update_valid_solutions)
        document.getElementById('valid_solutions').innerText = wordle_solver.wordle.valid_solutions.length
    })
}
update_valid_solutions()
const update_is_hard_mode = () => {
    requestAnimationFrame(() => {
        requestAnimationFrame(update_is_hard_mode)
        if (wordle_solver.wordle.is_hard_mode) {
            document.getElementById('is_hard_mode_checkbox').checked = true
            return
        }
        document.getElementById('is_hard_mode_checkbox').checked = false
    })
}
update_is_hard_mode()
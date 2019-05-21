const daysElement = document.getElementById('days')
const hoursElement = document.getElementById('hours')
const minutesElement = document.getElementById('minutes')
const secondsElement = document.getElementById('seconds')

const locationElement = document.getElementById('location')

const deadlineSpain = new Date(2019, 3, 26)
const deadlineUSA = new Date(2019, 4, 3)

let timerUpdate;

const getRemainTime = (deadline) => {

    const now = new Date()

    const totalTime = (new Date(deadline) - now) / 1000
    let totalDays = Math.floor(totalTime / (3600 * 24))
    let totalHours = Math.ceil((totalTime / 3600) % 24)
    if (totalHours == 24) {
        totalHours = 0
        totalDays++
    }

    let totalMinutes = Math.ceil((totalTime / 60) % 60)
    if (totalMinutes == 60) {
        totalMinutes = 0
    }

    let totalSeconds = Math.ceil(totalTime % 60)

    if (totalSeconds == 60) {
        totalSeconds = 59;
    }

    return {
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds
    }
}

const setRemainTime = (location) => {
    const timers =
        location == 'es'
            ? getRemainTime(deadlineSpain)
            : getRemainTime(deadlineUSA)
    
    daysElement.textContent = timers.totalDays
    hoursElement.textContent = timers.totalHours
    minutesElement.textContent = timers.totalMinutes
    secondsElement.textContent = timers.totalSeconds
}

locationElement.addEventListener('click', (e) => {
    clearInterval(timerUpdate)
    timerUpdate = setInterval(() => {
        setRemainTime(e.target.dataset.country);
    },1000)
})

locationElement.childNodes[1].click()
setRemainTime('usa');
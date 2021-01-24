import fetch from 'node-fetch'

const THRESHOLD = 1.1
const LABELS = ['Value1', 'Value2']

const toIfttt = send =>
  fetch(
    'https://maker.ifttt.com/trigger/badair/with/key/cwK-IOEGPSzYZdS1uoEE3P',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(send)
    })
    .then(response => response.text())
    .then(text => console.log(text))
    .catch((error) => {
      console.error('Error sending event to IFTTT:', error)
    })

// See API docs https://docs.google.com/document/d/15ijz94dXJ-YAZLi9iZ_RaBwrZ4KtYeCy08goGBwnbCU/edit
fetch('https://www.purpleair.com/json?key=ZDD0I4ZP3J9QVILG&show=91893')
  .then(response => response.json())
  .then(({ results }) => {
    const send = {}
    let messageCount = 0
    const n = results.length
    for (let i = 0; i < n; ++i) {
      const { Stats } = results[i]
      const { v, v1, v2, v3, v4, v5, v6 } = JSON.parse(Stats)
      const tenMinutes = v / v1
      const halfHour = v / v2
      const hour = v / v3
      const sixHours = v / v4
      const day = v / v5
      const week = v / v6
      if (tenMinutes > THRESHOLD) {
        ++messageCount
        send[LABELS[i]] = `PM2.5 air quality is ${tenMinutes} times worse than the ten minute average\n`
      }
      if (halfHour > THRESHOLD) {
        ++messageCount
        send[LABELS[i]] = `PM2.5 air quality is ${halfHour} times worse than the half-hour average\n`
      }
      if (hour > THRESHOLD) {
        ++messageCount
        send[LABELS[i]] = `PM2.5 air quality is ${hour} times worse than hourly average\n`
      }
      if (sixHours > THRESHOLD) {
        ++messageCount
        send[LABELS[i]] = `PM2.5 air quality is ${sixHours} times worse than the six-hour average\n`
      }
      if (day > THRESHOLD) {
        ++messageCount
        send[LABELS[i]] = `PM2.5 air quality is ${day} times worse than the daily average\n`
      }
      if (week > THRESHOLD) {
        ++messageCount
        send[LABELS[i]] = `PM2.5 air quality is ${week} times worse than the weekly average\n`
      }
    }
    if (!messageCount) {
      return
    }
    console.log(send)

    toIfttt(send)
  })
  .catch((error) => {
    console.error('Error getting data from Purple Air:', error)
  })

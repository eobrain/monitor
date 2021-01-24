import fetch from 'node-fetch'

const THRESHOLD = 1.1
const LABELS = ['Value1', 'Value2']

const toIfttt = send => {
  console.log(send)
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
}

// See API docs https://docs.google.com/document/d/15ijz94dXJ-YAZLi9iZ_RaBwrZ4KtYeCy08goGBwnbCU/edit
fetch('https://www.purpleair.com/json?key=ZDD0I4ZP3J9QVILG&show=91893')
  .then(response => response.json())
  .then(({ results }) => {
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
        toIfttt({ Value1: 'tenMinutes', Value2: tenMinutes })
        return
      }
      if (halfHour > THRESHOLD) {
        toIfttt({ Value1: 'halfHour', Value2: halfHour })
        return
      }
      if (hour > THRESHOLD) {
        toIfttt({ Value1: 'hour', Value2: hour })
        return
      }
      if (sixHours > THRESHOLD) {
        toIfttt({ Value1: 'sixHours', Value2: sixHours })
        return
      }
      if (day > THRESHOLD) {
        toIfttt({ Value1: 'day', Value2: day })
        return
      }
      if (week > THRESHOLD) {
        toIfttt({ Value1: 'week', Value2: week })
        return
      }
    }
  })
  .catch((error) => {
    console.error('Error getting data from Purple Air:', error)
  })

import './chart.js'
import './indicators.js'

async function getData () {
  const response = await fetch('/src/db/mock-dashboard.json')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data;
}

export { getData }

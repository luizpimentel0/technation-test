import { mountChart } from '../chart/script.js'
import { getData } from './index.js'

const selectedYear = document.getElementById('year')

const inadimplenciaElement = document.getElementById('inadimplenciaMesChart')
const receitasElement = document.getElementById('receitaMesChart')
let inadimplenciaChart = null
let receitasChart = null

const chartLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']


function mountChartData (indicadores, year) {
  const inadimplenciaChartData = []
  const receitasChartData = []

  indicadores.forEach(element => {
    if (element.label === 'valorTotalNotasVencidas') {
      for (const key in element.valores) {
        if (key.includes(year)) {
          inadimplenciaChartData.push(element.valores[key])
        }
      }
    } else {
      for (const key in element.valores) {
        if (key.includes(year)) {
          receitasChartData.push(element.valores[key])
        }
      }
    }

    if (inadimplenciaChart) {
      inadimplenciaChart.data.datasets[0].data = inadimplenciaChartData
      inadimplenciaChart.update()
    } else {
      inadimplenciaChart = mountChart(
        {
          element: inadimplenciaElement,
          type: 'bar',
          data: {
            labels: chartLabels,
            datasets: [{
              label: 'Inadimplência/Mês',
              data: inadimplenciaChartData,
              borderWidth: 2,
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.5)'
            }]
          }
        }
      )
    }

    if (receitasChart) {
      receitasChart.data.datasets[0].data = receitasChartData
      receitasChart.update()
    } else {
      receitasChart = mountChart(
        {
          element: receitasElement,
          type: 'line',
          data: {
            labels: chartLabels,
            datasets: [{
              label: 'Receitas/Mês',
              data: receitasChartData,
              borderWidth: 2,
              borderColor: 'green'
            }]
          },
        }
      )
    }
  })
}

async function updateChartYear() {
  const year = selectedYear.value
  const dashboardData = await getData()

  if (dashboardData !== undefined) {
    const indicadores = dashboardData.indicadores.filter(
      indicador => indicador.label === 'valorTotalNotasVencidas' || indicador.label === 'valorTotalNotasEmitidas'
    )
    mountChartData(indicadores, year)
  }
}

selectedYear.addEventListener('change', updateChartYear)

const dashboardData = await getData()

if (dashboardData !== undefined) {
  const indicadores = dashboardData.indicadores.filter(
    indicador => indicador.label === 'valorTotalNotasVencidas' || indicador.label === 'valorTotalNotasEmitidas'
  )
  mountChartData(indicadores, selectedYear.value)
}

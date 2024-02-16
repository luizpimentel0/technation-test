import { getData } from "./index.js"

const selectedTrimester = document.getElementById('trimester')
const selectedMonth = document.getElementById('month')
const selectedYear = document.getElementById('year')

const notasEmitidas = document.getElementById('notas-emitidas')
const notasSemCobranca = document.getElementById('notas-emitidas-sem-cobranca')
const notasVencidas = document.getElementById('notas-vencidas')
const notasAVencer = document.getElementById('notas-a-vencer')
const notasPagas = document.getElementById('notas-pagas')

const data = await getData()

function formatAndDisplay (value, element) {
  element.innerText = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function calculateTotalValues (indicador, year, month, trimester) {
  const valuesMap = new Map(Object.entries(indicador.valores))
  let total = 0
  
  if (month !== '' && !trimester) {
    for (const [ key, value ] of valuesMap.entries()) {
      if (key.includes(year) && key.slice(-2).includes(month)) {
        total += value
      }
    }
  } else if (trimester !== '') {
    selectedMonth.value = ''
    const trimesterMonths = {
      1: ['01', '02', '03'],
      2: ['04', '05', '06'],
      3: ['07', '08', '09'],
      4: ['10', '11', '12']
    }

    for (const [ key, value ] of valuesMap.entries()) {
      if (key.includes(year) && trimesterMonths[trimester].includes(key.slice(-2))) {
        total += value
      }
    }
  } else {
    for (const [ key, value ] of valuesMap.entries()) {
      if (key.includes(year)) {
        total += value
      }
    }
  }

  return total
}

selectedMonth.addEventListener('change', () =>
  mountIndicators(data.indicadores)
)

selectedTrimester.addEventListener('change', () =>
  mountIndicators(data.indicadores)
)

selectedYear.addEventListener('change', () =>
  mountIndicators(data.indicadores)
)

function mountIndicators (indicadores) {
  const year = selectedYear.value
  const month = selectedMonth.value
  const trimester = selectedTrimester.value

  indicadores.forEach(indicador => {
    if (indicador.label === 'valorTotalNotasEmitidas') {

      const valorTotalNotasEmitidas = calculateTotalValues(indicador, year, month, trimester)
      formatAndDisplay(valorTotalNotasEmitidas, notasEmitidas)
    } else if (indicador.label === 'valorTotalNotasEmitidasSemCobranca') {

      const valorTotalNotasSemCobranca = calculateTotalValues(indicador, year, month, trimester)
      formatAndDisplay(valorTotalNotasSemCobranca, notasSemCobranca)
    } else if (indicador.label === 'valorTotalNotasVencidas') {

      const valorTotalNotasVencidas = calculateTotalValues(indicador, year, month, trimester)
      formatAndDisplay(valorTotalNotasVencidas, notasVencidas)
    } else if (indicador.label === 'valorTotalNotasAVencer') {

      const valorTotalAVencer = calculateTotalValues(indicador, year, month, trimester)
      formatAndDisplay(valorTotalAVencer, notasAVencer)
    } else if (indicador.label === 'valorTotalNotasPagas') {

      const valorTotalPagas = calculateTotalValues(indicador, year, month, trimester)
      formatAndDisplay(valorTotalPagas, notasPagas)
    }
  });
}

if (data !== undefined) {
  mountIndicators(data.indicadores)
}

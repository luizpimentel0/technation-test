const tbody = document.querySelector('tbody');

const dateFilter = document.getElementById('dateFilter')
const monthFilter = document.getElementById('month')
const statusFilter = document.getElementById('status')

const filteredItems = [dateFilter, monthFilter, statusFilter]
filteredItems.forEach(item => item.addEventListener('change', handleChange))

async function getData() {
  const response = await fetch('/src/db/notes.json')

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data;
}


function filterItems({ item, filterDataMap, dateFilterValue, monthValue, statusValue }) {
  if (dateFilterValue) {
    const dateProperty = filterDataMap[dateFilterValue];
    if (!item[dateProperty] || !item[dateProperty].slice(5, 7).includes(monthValue)) {
      return false;
    }
  } else if (monthValue) {
    if (
        !item.dataEmissaoNota.slice(5, 7).includes(monthValue)
        && !item.dataCobranca.slice(5, 7).includes(monthValue) 
        && !item.dataPagamento.slice(5, 7).includes(monthValue)
    ) {
      return false
    }
  }

  if (statusValue) {
    const statusObj = {
      'emitida' : 'Emitida',
      'cobrancaRealizada' : 'Cobrança realizada',
      'atraso' : 'Pagamento atrasado',
      'pagamentoRealizado' : 'Pagamento realizado'
    }

    if (item.statusNota !== statusObj[statusValue]) {
      return false
    }
  }
  return true
}


async function handleChange () {
  const dateFilterValue = dateFilter.value
  const monthValue = monthFilter.value
  const statusValue = statusFilter.value

  data = await getData()
  let filteredData;

  const filterDataMap = {
    'emissao': 'dataEmissaoNota',
    'cobranca': 'dataCobranca',
    'pagamento': 'dataPagamento'
  }

  filteredData = data.filter(item => 
      filterItems({ item, filterDataMap, dateFilterValue, monthValue, statusValue })
  )

  mountAndDisplayTbodyData(filteredData)
}


function mountAndDisplayTbodyData (data) {
  let tbodyData = '';

  if (!data.length == 0) {
    data.forEach(({
      nome, identificacaoNota, dataEmissaoNota, dataCobranca, dataPagamento, documentoNotaFiscal, statusNota 
    }) => {

        const dataEmissaoFormatted = dataEmissaoNota ? new Date(dataEmissaoNota).toLocaleDateString('pt-BR', { timeZone : 'UTC'}) : 'NA'
        const dataCobrancaFormatted = dataCobranca ? new Date(dataCobranca).toLocaleDateString('pt-BR', { timeZone : 'UTC'}) : 'NA'
        const dataPagamentoFormatted = dataPagamento ? new Date(dataPagamento).toLocaleDateString('pt-BR', { timeZone : 'UTC'}) : 'NA'
        tbodyData += `
        <tr>
          <td>${nome}</td>
          <td>${identificacaoNota}</td>
          <td>${dataEmissaoFormatted}</td>
          <td>${dataCobrancaFormatted}</td>
          <td>${dataPagamentoFormatted}</td>
          <td>${documentoNotaFiscal}</td>
          <td>${statusNota}</td>
        </tr> `

        tbody.innerHTML = tbodyData
      })
    return
  }

  tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum registro encontrado</td></tr>'
}

getData().then(data => {
  mountAndDisplayTbodyData(data)
  return data;
})

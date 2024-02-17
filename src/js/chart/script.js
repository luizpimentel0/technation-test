const defaultOption = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
function mountChart({ element, type = 'bar', data, options = defaultOption}) {
  return new Chart(element, {
    type,
    data,
    options
  })
}

export { mountChart }

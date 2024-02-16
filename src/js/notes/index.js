const tbody = document.querySelector('tbody');

async function getData() {
  const response = await fetch('/src/db/notes.json')

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data;
}

const data = await getData();

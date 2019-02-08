document.addEventListener('DOMContentLoaded', setUpPage)
const hogContainer = document.querySelector('#hog-container')
const hogForm = document.querySelector('#container')
const url = 'http://localhost:3000/hogs'

function setUpPage() {
  renderAllHogs()
  addFormHandler()
}

// fetch hogs & return parsed data for use in renderAllHogs
function getHogs() {
  return fetch(url).then(res => res.json())
}

// clear container & use parsed data to render each hog
function renderAllHogs() {
  hogContainer.innerHTML = ""
  getHogs().then(function(data) {
    data.forEach(renderHog)
  })
}

// going through forEach -- rendering ONE hog
function renderHog(hog) {
  const hogCard = document.createElement('div')
  hogCard.className = 'hog-card'
  hogCard.dataset.id = hog.id

    const hogName = document.createElement('h2')
    hogName.textContent = hog.name
    hogCard.appendChild(hogName)

    const hogSpecialty = document.createElement('p')
    hogSpecialty.textContent = `Specialty: ${hog.specialty}`
    hogCard.appendChild(hogSpecialty)

    const greasedContainer = document.createElement('div')
    greasedContainer.textContent = 'Greased?'
    hogCard.appendChild(greasedContainer)

      const hogGreased = document.createElement('input')
      hogGreased.type = 'checkbox'
      // if hog is greased checkbox is checked
      if (hog.greased) {
        hogGreased.checked = true
      }
      // important to add id to this button later in changeGrease
      hogGreased.dataset.id = hog.id

    greasedContainer.appendChild(hogGreased)

    const hogWeight = document.createElement('p')
    hogWeight.textContent = `Weight: ${hog['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water']}`
    hogCard.appendChild(hogWeight)

    const highestMedal = document.createElement('p')
    highestMedal.textContent = `Highest Medal: ${hog['highest medal achieved']}`
    hogCard.appendChild(highestMedal)

    const hogImg = document.createElement('img')
    hogImg.src = hog.image
    hogCard.appendChild(hogImg)

    let deleteContainer = document.createElement('div')
    hogCard.appendChild(deleteContainer)

      const deleteBtn = document.createElement('button')
      deleteBtn.textContent = `Delete ${hog.name}`
      deleteContainer.appendChild(deleteBtn)

  hogContainer.appendChild(hogCard)

  deleteBtn.addEventListener('click', () => removeHog(hog))
  hogGreased.addEventListener('change', changeGrease)
}

function addFormHandler() {
  hogForm.addEventListener('submit', newHog)
}

function newHog() {
  event.preventDefault();

  // event.target.___.value comes from the 'name' in form
  let name = event.target.name.value
  let specialty = event.target.specialty.value
  let greased = event.target.greased.checked
  let weight = event.target.weight.value
  let medal = event.target.medal.value
  let img = event.target.img.value

  // passing in created variables (which are new hog values) into POST fetch request
  createHog(name, specialty, greased, weight, medal, img).then(renderHog)

  event.target.reset()
}

//////////// CREATING NEW HOG ////////////
function createHog(name, specialty, greased, weight, medal, img) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      specialty: specialty,
      greased: greased,
      'weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water': weight,
      'highest medal achieved': medal,
      image: img
    })
  }).then(res => res.json())
}

//////////// REMOVING HOG ////////////
function removeHog(hog) {
  // event.target = button, parent = button container, second parent = hog card
  let byeHog = event.target.parentElement.parentElement

  // byeHog's parent = hogContainer --> remove child byeHog
  byeHog.parentElement.removeChild(byeHog)

  // passing id to DELETE fetch request
  let id = hog.id
  deleteHog(id)
}

function deleteHog(id) {
  return fetch(`${url}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application-json'
    },
  })
}

//////////// UPDATING HOG ////////////
function changeGrease() {
  // returns whether box is checked or unchecked (boolean)
  let newGrease = event.target.checked

  let id = event.target.dataset.id
  updateGrease(id, newGrease)
}

function updateGrease(id, newGrease) {
  return fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      greased: newGrease
    })
  })
}

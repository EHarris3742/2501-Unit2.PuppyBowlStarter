// API URL
const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api/2501-ftb-et-web-am-PUPPIES/players"

// Global variables
let puppies = [] 
const puppiesListDiv = document.querySelector("#puppiesList")
const addPuppyForm = document.querySelector("#addPuppyForm")

// Handles hash routing
window.addEventListener("hashchange", () => {
  render()
})

//  Fetches all players from the API.
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(API_URL)
    const data = await response.json()
    puppies = data.data.players

    // Sanitize player names to support URL routing
    for (let i = 0; i < puppies.length; i++) {
      const dog = puppies[i]
      const dogName = dog.name
      if (dogName.indexOf(" ") >= 0) {
        const newDogName = dogName.replace(/\s+/g, '-')
        dog.name = newDogName
      }
    }

    render()
  } catch (error) {
    console.error(error)
  }
}

// Fetches a single player from the API.
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/${playerId}`)
    const data = await response.json()
    return data.data.player
  } catch (error) {
    console.error(error)
  }
}

// Adds a new player to the roster via the API.
const addNewPlayer = async (event) => {
  event.preventDefault()

  const newPuppy = {
    name: event.target.name.value.replace(/\s+/g, '-'),
    breed: event.target.breed.value,
    status: event.target.status.value,
    imageUrl: event.target.imageUrl.value,
    teamId: Number(event.target.teamId.value)
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPuppy)
    })
    const data = await response.json()
    puppies.push(data.data.newPlayer)

    // Clear form
    clearForm()

    // Render
    render()
  } catch (error) {
    console.error(error)
  }
}
addPuppyForm.addEventListener("submit", addNewPlayer)

// Removes a player from the roster via the API.
const removePlayer = async (event) => {
  // Only proceed if the delete button was clicked
  if (event.target.classList.contains("delete-Button")) {
    const playerId = Number(event.target.id)
    const playerName = event.target.name

    // Remove from local state
    puppies = puppies.filter(puppy => puppy.name !== playerName)

    try {
      const response = await fetch(`${API_URL}/${playerId}`, {
        method: "DELETE"
      })

      // Remove DOM element
      event.target.parentElement.remove()
    } catch (error) {
      console.error(error)
    }

    render()
  }
}

// Checks if user confirms deletion
const checkRemove = (event) => {
  console.log("!!", event)
  console.log("Are you sure?")
  if (confirm("Are you sure?")) {
    console.log("You pressed OK!")
    removePlayer(event)
  } else {
    console.log("You pressed Cancel!")
  }
}

// Clears the add puppy form
const clearForm = () => {
  addPuppyForm.name.value = ""
  addPuppyForm.breed.value = ""
  addPuppyForm.status.value = ""
  addPuppyForm.imageUrl.value = ""
  addPuppyForm.teamId.value = ""
  document.querySelector("#bench").checked = true
}

// Renders a single player's detailed card
const renderSinglePlayer = (player) => {
  const checkTeam = Number(player.teamId)

  const html = `
    <div class="singlePlayer">
      <div class="soloRow1">
        <img src=${player.imageUrl} />
      </div>
      <div class="soloRow2">
        <h2>Name:</h2>
        <p>${player.name}</p> 
        <h2>Breed:</h2>
        <p>${player.breed}</p> 
        <h2>Status:</h2>
        <p>${player.status}</p> 
        <h2 >TeamId:</h2>
        <p>${checkTeam <= 0 ? "Unassigned" : checkTeam}</p> 
        <br/>
        <a href="#" class="backButton">Back to all Players</a>
        <br/>
        <a class="delete-button" onclick="checkRemove(event)" id="${player.id}" name="${player.name}">Delete This Player</a>
      </div>
    </div>
  `
  return html
}

// Updates html to display a list of all players OR a single player page.
const render = () => {
  const pageName = window.location.hash.slice(1)
  const singlePlayer = puppies.find(player => player.name === pageName)

  const form = document.querySelector(".formContainer")

  // If viewing single player page
  if (singlePlayer) {
    puppiesListDiv.innerHTML = renderSinglePlayer(singlePlayer)
    form.style.display = "none"

    // Animate single player card
    gsap.from(".singlePlayer", 0.35, {
      scale: 0,
      ease: Back.easeOut,
      boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)"
    })
  } else {
    // Show all players
    const allPlayerHTML = puppies.map(puppy => {
      return `
        <a href=#${puppy.name}>
          <div class="playerCard">
            <img src="${puppy.imageUrl}" />
            <h3>${puppy.name}</h3>
          </div> 
        </a>
      `
    })

    puppiesListDiv.innerHTML = allPlayerHTML.join("")
    form.style.display = "block"

    // Animate player cards
    gsap.from(".playerCard", 0.35, {
      scale: 0,
      y: 300,
      ease: Back.easeOut,
      boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      stagger: 0.05
    })
  }
}

// Initializes the app by calling render
const init = async () => {
  console.log("init")
  await fetchAllPlayers()
}

init()

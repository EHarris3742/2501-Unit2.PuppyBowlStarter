const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
} = require("./script");

describe("fetchAllPlayers", () => {
  // Make the API call once before all the tests run
  let players;
  beforeAll(async () => {
    players = await fetchAllPlayers();
  });

  test("returns an array", async () => {
    expect(Array.isArray(players)).toBe(true);
  });

  test("returns players with name and id", async () => {
    players.forEach((player) => {
      expect(player).toHaveProperty("name"); // Check if player has 'name'
      expect(player).toHaveProperty("id");   // Check if player has 'id'
    });
  });
});

// TODO: Tests for `fetchSinglePlayer`

describe("fetchSinglePlayer", () => {
  test("returns a single player object with name and id", async () => {
    // First fetch all players to get a valid player ID
    const allPlayers = await fetchAllPlayers();
    const playerId = allPlayers[0]?.id;

    // If no player was found, skip the test
    if (!playerId) return;

    const singlePlayer = await fetchSinglePlayer(playerId);
    expect(singlePlayer).toHaveProperty("name"); // Check if single player has 'name'
    expect(singlePlayer).toHaveProperty("id");   // Check if single player has 'id'
  });
});

// TODO: Tests for `addNewPlayer`

describe("addNewPlayer", () => {
  test("successfully adds a new player and returns it", async () => {
    // Define a new player object to be added
    const newPlayer = {
      name: "Test Pup",        // Player name
      breed: "Testing Terrier",// Player breed
      image: "https://example.com/test-pup.jpg", // Player image URL
    };

    const addedPlayer = await addNewPlayer(newPlayer);

    // Expect the returned object to contain the same properties
    expect(addedPlayer).toHaveProperty("name", newPlayer.name);   // Check if name matches
    expect(addedPlayer).toHaveProperty("breed", newPlayer.breed); // Check if breed matches
    expect(addedPlayer).toHaveProperty("image", newPlayer.image); // Check if image URL matches
  });
});

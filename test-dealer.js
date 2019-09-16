let x = 0
let y = 0
let generated_index = 0
let deck: string[] = []
let game_status = 0
let last_registered_player = 0
let cards_left = 0
let players: number[] = []
let players_out: number[] = []
let current_player = 0
let generated_card = ""

radio.setGroup(21)
basic.showIcon(IconNames.Sad)

radio.onReceivedValue(function (name, value) {
    if (name == "pr") {
        register_player(value)
    } else if (name == "dc") {
        draw_card()
        next_turn()
    } else if (name == "sd") {
        stand_down()
        next_turn()
    }
})

input.onButtonPressed(Button.A, function () {
    if (game_status == 0) {
        open_lobby()
    } else if (game_status == 1) {
        start_game()
    }
    radio.sendValue("gs", game_status)
})

input.onButtonPressed(Button.B, function () {
    end_game()
})

function start_game() {
    game_status = 2
    reset_deck()

    basic.showIcon(IconNames.Happy)
    // Första spelaren har ID 1, men index 0 hos dealern -> current_player + 1
    radio.sendValue("nt", current_player + 1)
}

function open_lobby() {
    game_status = 1
    basic.showIcon(IconNames.Asleep)
}

function end_game() {
    game_status = 0
    players = []
    last_registered_player = 0
    radio.sendValue("gs", game_status)
    basic.showIcon(IconNames.Sad)
}

function register_player(id: number) {
    if (last_registered_player != id) {
        last_registered_player = id
        players.push(0)
        basic.showNumber(id)
        basic.pause(500)
        basic.showIcon(IconNames.Asleep)
    }
}

function next_turn() {
    if (players.length != players_out.length) {
        // Om det finns spelare kvar som inte lagt sig eller kommit över 21
        let has_found_player = 0
        while (has_found_player == 0) {
            if (current_player == players.length - 1) {
                current_player = 0
            } else {
                current_player += 1
            }

            // Om current_player inte finns i players_out så är det den spelarens tur
            if (players_out.indexOf(current_player) < 0) {
                has_found_player = 1
            }
        }
    } else {
        // Alla spelare har antingen förlorat eller lagt sig, bestäm en vinnare
        let highest_sum = 0
        let winners: number[] = []

        for (let i= 0; i < players.length; i++) {
            let sum = players[i]

            if (sum <= 21) {
                if (highest_sum < sum) {
                    // Ifall summan för spelaren är högre än dem vi redan kollat,
                    // återställ listan med vinnare och lägg till spelaren med högsta summan
                    highest_sum = sum
                    winners = []
                    winners.push(i)
                } else if (highest_sum == sum) {
                    // Ifall summan är densamma, lägg till spelaren till listan med vinnare
                    winners.push(i)
                } 
            } 
        }

        for (let j = 0; j <= winners.length - 1; j++) {
            // Dealern ser spelare med ID 1 som spelare 0 då den
            // använder sig utav index -> winner + 1
            radio.sendValue("pw", winners[j] + 1)
            basic.pause(100)
        }

        // Säg åt alla spelare att spelet är slut och de som inte fått ett "pw" med sitt ID antar att de har förlorat
        game_status = 3
        radio.sendValue("gs", game_status)
        basic.showIcon(IconNames.Duck)
    }
}

function remove_current_player_from_game() {
    players_out.push(current_player)
}

function stand_down() {
    remove_current_player_from_game()
}

function draw_card() {
    // Hämta värdet på kortet, exempelvis 10
    generate_card()

    // Uppdatera spelarens summa
    players[current_player] += get_card_value(generated_card)

    // Spelaren får alltid sitt kort, även spelaren kommer över 21
    radio.sendValue("nc", generated_index)

    if (players[current_player] > 21) {
        // Spelaren har gått över 21
        remove_current_player_from_game()
        radio.sendValue("yl", 0)
    }
}

function generate_card() {
    generated_index = Math.randomRange(0, cards_left)
    generated_card = deck.removeAt(generated_index)
    cards_left += -1
}

function get_card_value(card: string) {
    let value = 0
    if (card == 'J' || card == 'Q' || card == 'K') {
        value = 10
    } else if (card == 'A') {
        value = 11
    } else {
        value = parseInt(card)
    }

    return value
}

function reset_deck() {
    deck = ["2", "2", "2", "2", "3", "3", "3", "3", "4", "4", "4", "4", "5", "5", "5", "5", "6", "6", "6", "6", "7", "7", "7", "7", "8", "8", "8", "8", "9", "9", "9", "9", "10", "10", "10", "10", "A", "A", "A", "A", "J", "J", "J", "J", "Q", "Q", "Q", "Q", "K", "K", "K", "K"]
    cards_left = 51
}
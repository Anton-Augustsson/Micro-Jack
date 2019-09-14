radio.onReceivedValue(function (name, value) {
    if (name == "pr") {
        // Player register
        if (last_registered_player != value) {
            last_registered_player = value
            player_count += 1
            players.push(0)
            basic.showNumber(value)
            basic.pause(500)
            basic.showIcon(IconNames.Asleep)
        }
    } else if (name == "dc") {
        draw_card()
        next_turn()
    } else if (name == "sd") {
        // Stand down
        next_turn()
    }
})
function end_game() {
    game_status = 0
    players = []
    last_registered_player = 0
    radio.sendValue("gs", game_status)
    basic.showIcon(IconNames.Sad)
}
function reset_deck() {
    deck = ["2", "2", "2", "2", "3", "3", "3", "3", "4", "4", "4", "4", "5", "5", "5", "5", "6", "6", "6", "6", "7", "7", "7", "7", "8", "8", "8", "8", "9", "9", "9", "9", "10", "10", "10", "10", "A", "A", "A", "A", "J", "J", "J", "J", "Q", "Q", "Q", "Q", "K", "K", "K", "K"]
    cards_left = 51
}
function generate_card() {
    generated_index = Math.randomRange(0, cards_left)
    generated_card = deck.removeAt(generated_index)
    cards_left += -1
}
input.onButtonPressed(Button.A, function () {
    if (game_status == 0) {
        open_lobby()
    } else if (game_status == 1) {
        start_game()
    }
    radio.sendValue("gs", game_status)
})
function start_game() {
    players = []
    game_status = 2
    reset_deck()
    basic.showIcon(IconNames.Happy)
    radio.sendValue("nt", current_player + 1)
}
function draw_card() {
    // Hämta värdet på kortet, exempelvis 10
    generate_card()
    let card_value = get_card_value(generated_card)
    players[current_player] += card_value
    basic.pause(25)
    radio.sendValue("nc", generated_index)
    basic.pause(25)
    
    if (players[current_player] > 21) {
        // Spelaren har gått över 21
        player_count += 0 - 1
        players[current_player] = -1
        radio.sendValue("yl", 0)
    }
}
function next_turn() {
    if (player_count > 1) {
        if (player_count == current_player + 1) {
            current_player = 0
        } else {
            current_player += 1
        }
    } else {
        // Endast en spelare kvar, vi har en vinnare Skicka ut
        // kommando som säger att spelaren med id:t har vunnit
        radio.sendValue("pw", 0)
    }
    // Vi vill inte skicka ut next turn för spelare som
    // har summan -1 (de har förlorat)
    radio.sendValue("nt", current_player + 1)
}
function open_lobby() {
    game_status = 1
    basic.showIcon(IconNames.Asleep)
}
input.onButtonPressed(Button.B, function () {
    end_game()
})
let generated_index = 0
let deck: string[] = []
let game_status = 0
let player_count = 0
let last_registered_player = 0
let cards_left = 0
let players: number[] = []
let current_player = 0
let generated_card = ""
function get_card_value(card: string) {
    let value = 0
    if (card == 'J') {
        value = 10
    } else if (card == 'Q') {
        value = 10
    } else if (card == 'K') {
        value = 10
    } else if (card == 'A') {
        value = 11
    } else {
        value = parseInt(card)
    }

    return value
}
cards_left = 51
players = []
radio.setGroup(21)
basic.showIcon(IconNames.Sad)
basic.forever(function () {

})

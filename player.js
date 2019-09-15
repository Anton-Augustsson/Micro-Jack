let players = 0
let game_status = 0
let player_id = 0
let my_turn = 0
let has_lost = 0
let has_won = 0
let cards: string[] = []
let current_card = 0
let received_card = -1
let sum = 0
let deck = ["2", "2", "2", "2", "3", "3", "3", "3", "4", "4", "4", "4", "5", "5", "5", "5", "6", "6", "6", "6", "7", "7", "7", "7", "8", "8", "8", "8", "9", "9", "9", "9", "10", "10", "10", "10", "A", "A", "A", "A", "J", "J", "J", "J", "Q", "Q", "Q", "Q", "K", "K", "K", "K"]
radio.setGroup(21)

radio.onReceivedValue(function (name, value) {
    if (name == "pr") {
        on_player_registered(value)
    } else if (name == "gs") {
        on_game_status_changed(value)
    } else if (name == "nt") {
        on_new_turn(value)
    } else if (name == "nc") {
        on_new_card(value)
    } else if (name == "yl") {
        on_loss()
    } else if (name == "pw") {
        on_player_won(value)
    }
})

input.onButtonPressed(Button.A, function () {
    if (game_status == 1 && player_id == 0) {
        players += 1
        player_id = players
        radio.sendValue("pr", player_id)
    } else if (game_status == 2 && my_turn) {
        radio.sendValue("dc", 0)
    }
})

input.onButtonPressed(Button.B, function () {
    if (game_status == 2 && my_turn) {
        radio.sendValue("sd", 0)
    }
})

basic.forever(function () {
    basic.clearScreen()
    if (game_status == 0) {
        basic.showIcon(IconNames.Confused)
    } else if (game_status == 1) {
        if (player_id > 0) {
            basic.showNumber(player_id)
        } else {
            // Visa ikon här?
        }
    } else if (game_status == 2) {
        if (has_lost == 1) {
            // Du kan förlora innan spelet är klart
            basic.showIcon(IconNames.Skull)
        } else {
            if (received_card > -1) {
                basic.showString(deck[received_card])
            } else {
                loop_through_cards()
            }
        }
    } else {
        // Spelet är klart och vi vill visa om vi vann eller inte
        if (has_won == 1) {
            basic.showIcon(IconNames.Triangle)
        } else {
            basic.showIcon(IconNames.Skull)
        }
    }
})

function on_game_status_changed(state: number) {
    game_status = state

    if (game_status == 0) {
        // Inget spel är igång
        player_id = 0
        players = 0
        sum = 0
        cards = []
        has_lost = 0
        my_turn = 0
    } else if (game_status == 3) {
        // Spelet är slut, visa om du vann eller inte
        if (has_won) {
            basic.showIcon(IconNames.Happy)
        } else {
            basic.showIcon(IconNames.Sad)
        }
    }
}

function on_player_registered(count: number) {
    players = count
}

function on_new_turn(id: number) {
    if (id === player_id) {
        led.setBrightness(255)
        my_turn = 1
    } else {
        led.setBrightness(120)
        my_turn = 0
    }
}

function on_new_card(index: number) {
    if (my_turn) {
        let card = deck[index]
        cards.push(card)
        received_card = index
        // Vi kommer visa kortet du fick i 1500 ms
        basic.pause(1500)
        received_card = -1
    }
}

// Körs endast om du förlorar under din tur, d.v.s du kom över 21
function on_loss() {
    if (my_turn) {
        has_lost = 1
    }
}

function on_player_won(id: number) {
    if (id == player_id) {
        has_won = 1
    }
}

function loop_through_cards() {
    if (cards.length > 0) {
        basic.showString(cards[current_card])
        basic.pause(1000)
        if (current_card == cards.length - 1) {
            current_card = 0
        } else {
            current_card += 1
        }
    }
}

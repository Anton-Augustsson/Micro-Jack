function on_game_status_changed(state: number) {
    game_status = state

    if (game_status == 0) {
        player_id = 0
        players = 0
        sum = 0
        cards = []
        has_lost = 0
        my_turn = 0
    }
}

function on_new_turn(id: number) {
    // Next turn
    if (id === player_id) {
        led.setBrightness(255)
        my_turn = 1
        //basic.showIcon(IconNames.Diamond)
    } else {
        led.setBrightness(120)
        my_turn = 0
    }
}

function on_new_card(index: number) {
    if (my_turn) {
        // du får ett kort och det är din tur, gör något
        let card = deck[index]
        cards.push(card)
        received_card = index
    }
}

function on_loss() {
    if (my_turn) {
        // Du har förlorat
        has_lost = 1
    }
}

function on_player_won(id: number) {
    if (id == player_id) {
        has_won = 1
    }
}

function loop_cards() {
    if (cards.length > 0) {
        //basic.showNumber(cards[current_card])
        if (current_card + 1 >= cards.length) {
            current_card = 0
        } else {
            current_card += 1
        }
    }
}


radio.onReceivedValue(function (name, value) {
    if (name == "pr") {
        // Player register
        players = value
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
    } else if (game_status == 2 && my_turn == 1) {
        radio.sendValue("dc", 0)
    }
})

input.onButtonPressed(Button.B, function () {
    if (game_status == 2 && my_turn) {
        radio.sendValue("sd", 0)
    }
})
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
basic.forever(function () {
    basic.clearScreen()
    if (game_status == 0) {
        basic.showIcon(IconNames.Confused)
    } else if (game_status == 1) {
        if (player_id > 0) {
            basic.showNumber(player_id)
        }
    } else {
        if (has_lost == 1) {
            // Du har förlorat
            basic.showIcon(IconNames.Skull)
        } else if (has_won == 1) {
            basic.showIcon(IconNames.Triangle)
        } else {
            if (received_card > -1) {
                
                //basic.showString(deck[received_card])
                basic.pause(1500)
                received_card = -1
            }
        }
    }
})

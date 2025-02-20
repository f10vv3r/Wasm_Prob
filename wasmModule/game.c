#include <stdio.h>
#include <stdint.h>
#include <limits.h>
#include <emscripten.h>

/*
초기 상태:
 - Dragon HP: 100
 - Knight HP: 80
 - Archer HP: 70
*/

// Knight 공격 함수
EMSCRIPTEN_KEEPALIVE
int knightAttack(int8_t *dragon_hp, int8_t *knight_hp, int8_t knight_atk_no) {
    int8_t knight_atk = 0;

    if (knight_atk_no == 1) {
        knight_atk = 40;
    } else if (knight_atk_no == 2) {
        knight_atk = 35;
    } else if (knight_atk_no == 3) {
        knight_atk = 30;
    } else {
        printf("No hack!!\n");
        return -1;
    }

    int new_dragon_hp = *dragon_hp - knight_atk;

    *dragon_hp = (int8_t)new_dragon_hp;

    printf("Knight attacked! Dragon HP: %d, Knight HP: %d\n", *dragon_hp, *knight_hp);
    return 0;
}

// Archer 공격 함수
EMSCRIPTEN_KEEPALIVE
int archerAttack(int8_t *dragon_hp, int8_t *archer_hp, int8_t archer_atk_no) {
    int8_t archer_atk = 0;

    if (archer_atk_no == 1) {
        archer_atk = 20;
    } else if (archer_atk_no == 2) {
        archer_atk = 15;
    } else if (archer_atk_no == 3) {
        archer_atk = 0;
    } else {
        printf("No hack!!\n");
        return -1;
    }

    int new_dragon_hp = *dragon_hp - archer_atk;

    *dragon_hp = (int8_t)new_dragon_hp;

    printf("Archer attacked! Dragon HP: %d, Archer HP: %d\n", *dragon_hp, *archer_hp);
    return 0;
}

// Dragon 공격 함수
EMSCRIPTEN_KEEPALIVE
int dragonAttack(int8_t *dragon_hp, int8_t *player_hp) {
    int dragon_atk = 35;

    int new_player_hp = *player_hp - dragon_atk;
    *player_hp = (int8_t)new_player_hp;

    printf("Dragon attacked! Dragon HP: %d, Player HP: %d\n", *dragon_hp, *player_hp);
    return 0;
}

// Dragon 힐링 함수
EMSCRIPTEN_KEEPALIVE
int dragonHeal(int8_t *dragon_hp) {
    int8_t healing_amount = 20;
    *dragon_hp += healing_amount;
    
    printf("Dragon healed! Healing amount: %d, Dragon HP: %d\n", healing_amount, *dragon_hp);
    return *dragon_hp;
}

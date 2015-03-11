var terrains = require('./terrains.js')

function Battle(attacker, defender, terrain, crossing) {
	return {
		attacker: attacker, 
		defender: defender, 
		terrain: terrain, 
		crossing: crossing
	}
}

function General(fire, shock, manouver, siege) {
	return {
		fire: fire,
		shock: shock,
		manouver: manouver,
		siege: siege
	}
}

function Army(general, divisions, morale) {
	return {
		general: general,
		divisions: divisions,
		morale: morale
	}
}

function Regiment(size, type, fire, shock, morale_pips) {
	return {
		size: size,
		fire: fire,
		shock: shock,
		morale: morale
	}
}

function roll() {
	return Math.floor((Math.random())*10)
}

function tick(battle, attacker_roll, defender_roll) {

	//attacker_roll = attacker_roll + battle.terrain.attacker_modifier + battle.crossing
}

attacker = {
	infantry: 10 ,
	cavalry: 10,
	artillery: 10,
	discipline: 3,
	morale: 3,
	combat_width: 10,
	general: General(1, 1, 1, 1)
}

defender = {
	infantry: 10,
	cavalry: 10,
	artillery: 10,
	discipline: 3,
	morale: 3,
	combat_width: 10,
	general: General(1, 1, 1, 1)
}
b = Battle(attacker, defender, terrains.plains, -2)
tick(b, roll(), roll())
console.log(terrains.plains)

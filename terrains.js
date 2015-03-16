function Terrain(combat_width, attacker_modifier) {
	this.combat_width = combat_width; 
	this.attacker_modifier = attacker_modifier;
}

exports.plains = new Terrain(1, 0)
exports.forest = new Terrain(0.8, 1)
exports.hills = new Terrain(0.75, -1)
exports.mountains = new Terrain(0.5, -2)
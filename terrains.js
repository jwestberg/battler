function Terrain(combat_width, attacker_modifier) {
	return { 
		combat_width: combat_width, 
		attacker_modifier: attacker_modifier 
	}
}

exports.plains = Terrain(1, 0)
exports.forest = Terrain(0.8, 1)
exports.hills = Terrain(0.75, -1)
exports.mountains = Terrain(0.5, -2)
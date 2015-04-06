var terrains = require('./terrains.js')
var tech = require('./tech.js')
var _und = require('./lib/underscore.js')

function Battle(attacker, defender, terrain, crossing) {
	this.attacker = attacker; 
  this.defender = defender; 
  this.terrain = terrain;
	this.crossing = crossing;
  
  attacker.deploy(terrain);
  defender.deploy(terrain);
  
  
}

function General(fire, shock, manouver, siege) {
	this.fire = fire;
	this.shock = shock;
  this.manouver = manouver;
  this.siege = siege;
}

function Country(tech_level, tech_group, discipline, max_morale) {
  this.tech_level = tech_level;
  this.tech_group = tech_group;
  this.discipline = discipline;
  this.max_morale = max_morale;
}

function Army(general, country, num_infantry, num_cavalry, num_artillery) {
  this.general = general;
  this.country = country;
  
  var ms = function(tag, regs) {
    return _und.map(regs, function(reg) {
      reg.morale = tag.max_morale;
      reg.strength = 1000;
      return reg;
    });
  };
  
  var multiply = function(object, size) {
    var array = []
    for(var i=0; i<size; i++) {
      array.push(JSON.parse(JSON.stringify(object)))
    }
    return array;
  };
  
  this.infantry = ms(country, multiply(tech.getInfantry(country.tech_level, country.tech_group), num_infantry));
  this.cavalry = ms(country, multiply(tech.getCavalry(country.tech_level, country.tech_group), num_cavalry));
  this.artillery = ms(country, multiply(tech.getArtillery(country.tech_level, country.tech_group), num_artillery));
  
  this.size = function() {
    return _und.reduce(this.infantry.concat(this.cavalry).concat(this.artillery), function(memo, unit) { 
      return memo + unit.strength; 
    }, 0)
  }
  
  this.firstrow = []
  this.secondrow = []
  
  this._deployCavalry = function(width, cavalryreserved, row) {
    cav = _und.filter(this.cavalry, function(cav) { return !cav.deployed; })
    
    for(i = 0; i<cavalryreserved && i<cav.length; i++) {
      if(i%2 === 0) {
        row[i/2] = cav[i];
      } else {
        row[width-Math.floor(i/2)] = cav[i];
      }
      cav[i].deployed = true;
    }
  }
  
  this._fillInfantry = function(width, row) {
    for(i=0; i<width; i++) {
      x = (i%2 === 0) ? Math.floor(width/2)-Math.floor(i/2) : Math.floor(width/2)+Math.ceil(i/2);
      if(typeof row[x] == 'undefined') {
        row[x] = _und.find(this.infantry, function(unit) { return !unit.deployed; });
        if(typeof row[x] != 'undefined') {
          row[x].deployed = true; 
        }
      }
    }
  }
  
  this.deploy = function(terrain) {
    var width = Math.floor(tech.getModifiers(this.country.tech_level).combat_width * terrain.combat_width); //TODO: Verify floor is correct
    var cavalryreserved = 2*(Math.floor(width/10)) + 2; //TODO: Observe in the wild
    for (i = 0; i<width-cavalryreserved && i<this.infantry.length; i++) {
      if(i%2 === 0) {
        this.firstrow[Math.floor(width/2)-i/2] = this.infantry[i];
      } else {
        this.firstrow[Math.floor(width/2)+Math.ceil(i/2)] = this.infantry[i]
      }
      this.infantry[i].deployed = true
    }
    this._deployCavalry(width, cavalryreserved, this.firstrow)
    this._fillInfantry(width, this.firstrow)
    for (i = 0; i<width && i<this.artillery.length; i++) {
      var location = (i%2 === 0) ? Math.floor(width/2)-i/2 : Math.floor(width/2)+Math.ceil(i/2);
      if(typeof this.firstrow[location] != 'undefined' && this.firstrow[location].type == 'infantry') {
        this.secondrow[location] = this.artillery[i];
        this.secondrow[location].deployed = true;
      } else if (typeof this.firstrow[location] == 'undefined') {
        this.firstrow[location] = this.artillery[i];
        this.firstrow[location].deployed = true;
      }
    }
    this._deployCavalry(width, cavalryreserved, this.secondrow)
    this._fillInfantry(width, this.secondrow)
  };
  
  this.asciiRows = function() {
    fr = ''
    sr = ''
    for(i = 0; i<this.firstrow.length; i++) {
      fr += typeof this.firstrow[i] != 'undefined' ? this.firstrow[i].type.charAt(0) : ' ';
      sr += typeof this.secondrow[i] != 'undefined' ? this.secondrow[i].type.charAt(0) : ' ';
    }
    return fr+'\n'+sr;
  }
}

function roll() {
	return Math.floor((Math.random())*10)
}

function tick(battle, attacker_roll, defender_roll) {

	//attacker_roll = attacker_roll + battle.terrain.attacker_modifier + battle.crossing
}

var attacker_country = new Country(10, "western", 2.5, 2.5)
var defender_country = new Country(10, "chinese", 2.5, 2.5)
var general = new General(1,1,1,1);

var attacker_army = new Army(general, attacker_country, 7, 8, 100);
var defender_army = new Army(general, defender_country, 5, 1, 1);
var battle = new Battle(attacker_army, defender_army, terrains.mountains, -1)

console.log(attacker_army.asciiRows())
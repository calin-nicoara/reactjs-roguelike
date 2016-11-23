var React = require('react');
var Dungeon = require('../components/Dungeon');

function PlayerStats(props) {
  return <div className="playerStats">
    Health: {props.heroState.health}  Weapon: {props.heroState.weapon} Attack: {props.heroState.attack}  Level: {props.heroState.level} Next Level: 100 XP Dungeon: {props.heroState.dungeon}
  </div>
}

class DungeonContainer extends React.Component {
  constructor() {
    super();

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.keyboardCodes = {
      37: 'KEY_LEFT',
      38: 'KEY_UP',
      39: 'KEY_RIGHT',
      40: 'KEY_DOWN'
    };

    this.gridStates = {
      EMPTY: {
        value: 1,
        className: 'grid-square-empty'
      },
      WALL: {
        value: 2,
        className: 'grid-square-wall'
      },
      HERO: {
        value: 3,
        className: 'grid-square-hero'
      },
      ENEMY: {
        value: 4,
        className: 'grid-square-enemy'
      },
      HEALTH: {
        value: 5,
        className: 'grid-square-health'
      },
      WEAPON: {
        value: 6,
        className: 'grid-square-weapon'
      },
      BOSS: {
        value: 7,
        className: 'grid-square-boss'
      },
      PORTAL: {
        value: 8,
        className: 'grid-square-portal'
      }
    };

    this.length = 50;
    this.height = 50;

    this.heroCoord = {
      x: 1,
      y: 1
    };

    this.enemyCoord = {
      x: 4,
      y: 3
    };

    this.healthCoord = {
      x: 6,
      y: 7
    };

    this.weaponCoord = {
      x: 8,
      y: 4
    };

    this.portalCoord = {
      x: 3,
      y: 9,
    };

    const grid = [];
    for(let heightIndex = 0; heightIndex < this.height; heightIndex++) {
      grid[heightIndex] = [];
      for(let lengthIndex = 0; lengthIndex < this.length; lengthIndex++) {
        let currentGridState;
        if(heightIndex === 0 || heightIndex === this.height-1 || lengthIndex === 0 || lengthIndex === this.length-1) {
          currentGridState = this.gridStates.WALL;
        } else if(heightIndex === this.heroCoord.y && lengthIndex === this.heroCoord.x) {
          currentGridState = this.gridStates.HERO;
        } else if(heightIndex === this.enemyCoord.y && lengthIndex === this.enemyCoord.x){
          currentGridState = this.gridStates.ENEMY;
        } else if(heightIndex === this.healthCoord.y && lengthIndex === this.healthCoord.x){
          currentGridState = this.gridStates.HEALTH;
        } else if(heightIndex === this.weaponCoord.y && lengthIndex === this.weaponCoord.x){
          currentGridState = this.gridStates.WEAPON;
        } else if(heightIndex === this.portalCoord.y && lengthIndex === this.portalCoord.x){
          currentGridState = this.gridStates.PORTAL;
        } else {
          currentGridState = this.gridStates.EMPTY;
        }
        grid[heightIndex][lengthIndex] = currentGridState;
      }
    }

    this.state = {
      grid: grid,
      heroState: {
        health: 300,
        weapon: 'stick',
        attack: 14,
        level: 0,
        dungeon: 0
      }
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.showRow = this.showRow.bind(this);
  }
  handleKeyDown(event) {
    let keyPress = this.keyboardCodes[event.keyCode];
    const newHeroPosition = JSON.parse(JSON.stringify(this.heroCoord));

    if(!!keyPress) {
      switch(keyPress) {
        case 'KEY_LEFT':
          --newHeroPosition.y;
          break;
        case 'KEY_UP':
          --newHeroPosition.x;
          break;
        case 'KEY_RIGHT':
          ++newHeroPosition.y;
          break;
        case 'KEY_DOWN':
          ++newHeroPosition.x;
          break;
      }

      if(this.state.grid[newHeroPosition.x][newHeroPosition.y].value === this.gridStates.EMPTY.value) {
        this.state.grid[this.heroCoord.x][this.heroCoord.y] = this.gridStates.EMPTY;
        this.state.grid[newHeroPosition.x][newHeroPosition.y] = this.gridStates.HERO;

        this.heroCoord = JSON.parse(JSON.stringify(newHeroPosition));

        this.setState(this.state);
      }
    }
  }
  showRow(gridRow, rowIndex) {
    return gridRow.map((gridSquare, columnIndex) => {
      return (
        <div className={gridSquare.className + ' grid-square'} key={rowIndex + this.length * columnIndex }></div>
      )
    })
  }
  render() {
    return (
      <div className="container display">
        <PlayerStats heroState={this.state.heroState}/>
        <div tabIndex='0' onKeyDown={this.handleKeyDown} className='dungeon'>
          {
            this.state.grid.map( (gridRow, rowIndex) =>
              <div className="row" key={rowIndex}>{this.showRow(gridRow, rowIndex)}</div>
            )
          }
        </div>
      </div>
    )
  }
}

module.exports = DungeonContainer;
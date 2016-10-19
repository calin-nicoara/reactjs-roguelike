var React = require('react');
var Dungeon = require('../components/Dungeon');

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

    this.state = {
      heroPosition: {
        top: 20,
        left: 80
      }
    };
  }
  componentDidMount() {
    var hero = document.getElementById('hero');
    hero.style.top = this.state.heroPosition.top + 'px';
    hero.style.left = this.state.heroPosition.left + 'px';
  }
  handleKeyDown(event) {
    var keyPress = this.keyboardCodes[event.keyCode];
    if(!!keyPress) {
      var hero = document.getElementById('hero');
      switch(keyPress) {
        case 'KEY_LEFT':
          this.state.heroPosition.left -= 10;
          hero.style.left = this.state.heroPosition.left + 'px';
          break;
        case 'KEY_UP':
          this.state.heroPosition.top -= 10;
          hero.style.top = this.state.heroPosition.top + 'px';
          break;
        case 'KEY_RIGHT':
          this.state.heroPosition.left += 10;
          hero.style.left = this.state.heroPosition.left + 'px';
          break;
        case 'KEY_DOWN':
          this.state.heroPosition.top += 10;
          hero.style.top = this.state.heroPosition.top + 'px';
          break;
      }

      this.setState(this.state);
    }
  }
  render() {
    return (
      <div tabIndex='0' onKeyDown={this.handleKeyDown} className='container dungeon'>
        <div id='hero' className='game-object'></div>
      </div>
    )
  }
}

module.exports = DungeonContainer;
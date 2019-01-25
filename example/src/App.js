import React, {Component} from 'react'
import cx from 'classnames';
import Row from './Row'

import List from 'vscrollr.js'

const staticItems = [...new Array(100)].map((_, idx) => {
  const is3 = idx % 3 === 0;
  const is5 = idx % 5 === 0;
  const fizzbuzz = (is3 ? 'fizz' : '') + ((is3 && is5 && "<br/>") || "") + (is5 ? 'buzz' : '');
  return {
    title: fizzbuzz.trim() === '' ? idx : fizzbuzz,
    content: 'lorem'
  };
});

export default class App extends Component {
  state = {
    items: staticItems,
    expanded: []
  };

  onToggle = (index) => {
    return () => {
      this.setState({
        expanded: {
          ...this.state.expanded,
          [index]: !this.state.expanded[index]
        }
      })
    }
  };

  rowRenderer = ({index, key, isVisible, isScrolling, setRef}) => {
    const {items, expanded} = this.state;
    let item = items[index];
    return (
      <Row
        key={key}
        setRef={setRef}

        className={cx({
          isVisible,
          isScrolling,
        })}
        id={index}
        model={item}
        expanded={expanded[index]}
        toggle={this.onToggle(index)}
      />
    )
  };

  render() {
    const {items} = this.state;
    return (
      <div className="scroll-container">
        <h2 style={{height: 20, lineHeight: "20px"}}>Header</h2>
        <List
          rowsCount={items.length}
          rowRenderer={this.rowRenderer}
          containerClassName="scroll-container"
        />
      </div>
    )
  }
}

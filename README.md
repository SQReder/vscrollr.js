# vscrollr.js

> Virtual scrolling list with relative positioning

[![NPM](https://img.shields.io/npm/v/vscrollr.js.svg)](https://www.npmjs.com/package/vscrollr.js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save vscrollr.js
```

## Usage

```tsx
import React from 'react'

import List from 'vscrollr.js'

class Example extends React.Component {
  state = {
    items: staticItems,
  };
  
  rowRenderer = ({index, key, isVisible, isScrolling, setRef}) => {
    const {items} = this.state;
    let item = items[index];
    return (
      <div key={key} ref={setRef}>
        {item}
      </div>
    )
  };
  
  render () {
    const {items} = this.state;
    return (
      <div className="scroll-container">
        <List
          rowsCount={items.length}
          rowRenderer={this.rowRenderer}
          containerClassName="scroll-container"/>
      </div>
    )
  }
}
```

## License

MIT © [SQReder](https://github.com/SQReder)

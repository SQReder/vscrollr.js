/**
 * @class VirtualList
 */

import * as React from 'react';
import * as R from "ramda";
import styles from './styles.css';

export interface RowRendererParams {
  index: number;
  key: string | number;
  isVisible: boolean;
  isScrolling: boolean;
  setRef: (element: HTMLElement) => void;
}

export type RowRendererCallback = (args: RowRendererParams) => JSX.Element;

export interface Props {
  text: string,
  rowsCount: number,
  rowRenderer: RowRendererCallback,
  containerClassName: string,
}

export interface State {
  containerRef: Element | null,
  isScrolling: boolean,
  visible: {
    first: number,
    last: number,
  },
  offset: {
    top: number,
    bottom: number,
  }
  padding: {
    top: number,
    bottom: number,
  },
  forceRefresh: boolean,
}


export default class VirtualList extends React.Component<Props, State> {

  private wrapperRef = React.createRef<HTMLDivElement>();
  private heightsCache: number[] = [];


  constructor(props: Props) {
    super(props);

    this.state = {
      containerRef: null,
      isScrolling: false,
      visible: {
        first: 0,
        last: 0,
      },
      offset: {
        top: 0,
        bottom: 0,
      },
      padding: {
        top: 0,
        bottom: 0,
      },
      forceRefresh: false,
    }
  }

  componentDidMount(): void {
    const wrapperRef = this.wrapperRef.current;
    if (wrapperRef) {
      const containerRef = wrapperRef.closest("." + this.props.containerClassName);

      if (containerRef != null) {
        containerRef.addEventListener("scroll", this.scrollListener);

        this.setState({
          containerRef: containerRef
        });
      }
    }

    setTimeout(() => {
      this.updateBuffer();
    });
  }

  componentWillUnmount(): void {
    if (this.state.containerRef) {
      this.state.containerRef.removeEventListener("scroll", this.scrollListener);
    }
  }

  componentDidUpdate(): void {
    if (this.state.forceRefresh) {
      this.updateBuffer();
    }
  }

  render() {
    const {
      rowRenderer,
    } = this.props;

    const {padding, visible} = this.state;

    const items = R.map(i => rowRenderer({
      index: i,
      key: i,
      isVisible: visible.first <= i && i <= visible.last,
      isScrolling: this.state.isScrolling,
      setRef: el => {
        this.setRef(el, i);
      }
    }), R.range(visible.first, visible.last));

    return (
      <div className={styles.wrapper} ref={this.wrapperRef}>
        <div className={styles["padded-container"]} style={{
          paddingTop: padding.top,
          paddingBottom: padding.bottom,
        }}>
          {items}
        </div>
      </div>
    )
  }

  private scrollListener = () => {
    this.setState({
      isScrolling: true,
    });

    this.updateBuffer();

    setTimeout(() => {
      this.setState({
        isScrolling: false,
      })
    }, 1000)
  };

  private updateBuffer = () => {
    const {containerRef} = this.state;

    const current = this.wrapperRef.current;

    if (current == null || containerRef == null) {
      return;
    }

    const offsetTop = current.offsetTop;
    const scrollTop = containerRef.scrollTop;
    const containerHeight = containerRef.getBoundingClientRect().height;
    console.log(containerHeight);

    const heights = R.map((i: number) => this.heightsCache[i] || 10, R.range(0, this.props.rowsCount));

    type Created = { i: number, bottom: number };

    const sumHeightWhile = R.partialRight<Created>(R.reduceWhile, [
      (acc: Created, h: number): Created => ({i: acc.i + 1, bottom: acc.bottom + h}),
      {i: 0, bottom: 0},
      heights
    ]);

    const firstVisible = sumHeightWhile((acc: Created) => acc.bottom + heights[acc.i] + offsetTop < scrollTop);
    const lastVisible = sumHeightWhile((acc: Created) => acc.bottom + offsetTop <= scrollTop + containerHeight);

    const paddingTop = R.sum(R.map(i => heights[i], R.range(0, firstVisible.i)));
    const paddingBottom = R.sum(R.map(i => heights[i], R.range(lastVisible.i, heights.length)));

    this.setState({
      visible: {
        first: firstVisible.i,
        last: lastVisible.i,
      },
      padding: {
        top: paddingTop,
        bottom: paddingBottom,
      },
      forceRefresh: false,
    })
  };

  private setRef(el: HTMLElement, i: number) {
    if (el) {
      let newValue = el.getBoundingClientRect().height;
      const oldValue = this.heightsCache[i];
      if (newValue !== oldValue) {
        this.heightsCache[i] = newValue;
        this.setState({
          forceRefresh: true,
        })
      }
    }
  }
}

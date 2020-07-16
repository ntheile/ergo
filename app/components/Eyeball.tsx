import React from 'react';

declare let global: any;
let xx = window.innerWidth / 2;
let yy = window.innerHeight / 2;

const getPosition = (elapsedTime, h, k) => {
    const a = (4 * k) / Math.pow(h * 2, 2); // coefficient: -.000483932
    const ypos = a * Math.pow((((elapsedTime + h) % (h * 2)) - h), 2);
    return ypos;
};
  
  // default ball style, CSS in JS
  const style = {
    display: 'block',
    position: 'absolute',
    width: 50,
    height: 50,
    top: yy,
    right: xx,
    borderRadius: '50%',
    backgroundColor: '#00CFFF',
  };
  
  // renders a Ball at a certain height
 export const Ball = ({ y }) => (
    <div
      style={{
        ...style,
        top: y,
      }}
    />
  );

// performs a Quadratic Ease in and Ease out repeatedly
export default class Eyeball extends React.Component {
    state = {
      beginning: Date.now(),
    }
  
    componentWillMount() {
      this.setState({ interval: setInterval(this.updateValue, 20) });
    }
  
    componentWillUnmount() {
      clearInterval(this.state.interval);
    }
  
    updateValue = () => {
      const {
        props: {
          duration,
          start,
          end,
        },
        state: {
          beginning,
        },
      } = this;
  
      const time = Date.now() - beginning;
      const value = start + getPosition(time, duration / 2, end - start);
      this.setState({ value });
    };
  
    render() {
      const renderedChildren = this.props.children(this.state.value);
      return renderedChildren && React.Children.only(renderedChildren);
    }
  }

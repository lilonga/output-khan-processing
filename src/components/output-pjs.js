import React from "react";
import PropTypes from "prop-types";

import "processing-js/processing.min.js";
import ExposePJS from "../util/expose-pjs";
const Processing = window.Processing;

class PjsWrapper extends React.Component {
  componentDidMount() {
    this.pjs = new Processing(this.canvas, this.props.sketch);
    if (this.pjs.newPropsHandler) {
      this.pjs.newPropsHandler(this.props);
      setTimeout(() => this.pjs.newPropsHandler(this.props), 220);
    }
  }

  componentWillReceiveProps(newprops) {
    if (this.props.sketch !== newprops.sketch || this.props.reloadOnRender) {
      // this.pjs.remove();
      this.pjs = new Processing(this.canvas, newprops.sketch);
    }
    if (this.pjs.newPropsHandler) {
      this.pjs.newPropsHandler(newprops);
    }
  }

  componentWillUnmount() {
    // this.pjs.remove();
  }

  render() {
    return (
      <div ref={wrapper => (this.wrapper = wrapper)}>
        <canvas
          ref={canvas => (this.canvas = canvas)}
        />
      </div>
    );
  }
}

export default class OutputP5 extends React.Component {
  static defaultProps = {
    width: 200,
    height: 200,
    input: "line(0,0,100,100)"
  };
  static propTypes = {
    /** Width of canvas */
    width: PropTypes.number,
    /** Height of canvas */
    height: PropTypes.number,
    /** Processing.js code in string format */
    input: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.pjsRunner = this.pjsRunner.bind(this);
  }
  pjsRunner(p) {
    let input = this.props.input;
    //Use width/height from props
    p.size(this.props.width, this.props.height);

    p.newPropsHandler = props => {
      if (props.input) {
        input = props.input;
      }
      try {
        var draw;
        eval(ExposePJS + input);
        if (typeof draw === "function") {
          p.draw = draw;
        }
      } catch (e) {
        console.log(e);
      }
    };

    try {
      var draw;
      eval(ExposePJS + input);
      if (typeof draw === "function") {
        p.draw = draw.bind(p);
      }
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    return (
      <PjsWrapper
        reloadOnRender={true}
        sketch={this.pjsRunner}
        input={this.props.input}
      />
    );
  }
}

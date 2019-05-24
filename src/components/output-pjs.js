import React from "react";
import PropTypes from "prop-types";
import raw from 'raw.macro'
const kpjs = raw('../kpjs.js')

export default class OutputPjs extends React.Component {
  static defaultProps = {
    width: 400,
    height: 400,
    input: "line(0,0,100,100);"
  };
  static propTypes = {
    /** Width of canvas */
    width: PropTypes.number,
    /** Height of canvas */
    height: PropTypes.number,
    /** Processing.js code in string format */
    input: PropTypes.string
  };
  constructor(props) {
    super(props);
  }

  render() {
    let { width, height, input } = this.props;
    let sketchString = `
      //set by default in khan editor
      angleMode = "degrees"
      size(${width},${height});
      ${input}
    `;

    const srcDoc = `
<!DOCTYPE html>
<html>
  <head>
    <title>Processing.JS</title>
    <style>
        * {
        overflow:hidden;
        box-sizing:border-box;
        border:none;
        margin:0;
        padding:0;

      }
    </style>
  </head>
  <body>
      <canvas  id="mycanvas" ></canvas>
  </body>

<script>
${kpjs}
</script>
  <script>
        var sketchString = \`${sketchString}\`
        var sketchProc = function(processingInstance) {
         with (processingInstance) {
            eval(sketchString)
            }
          };
        var canvas = document.getElementById("mycanvas");
        var processingInstance = new Processing(canvas, sketchProc);
  </script>
</html>
    `;
    let iframeStyle = {
      border:"none",
      minWidth:"100%",
      minHeight:"100%"
    }
    return <iframe   {...this.props} style={iframeStyle} srcDoc={srcDoc} />;
  }
}


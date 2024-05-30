import "@benrbray/prosemirror-math/dist/prosemirror-math.css";
import "prosemirror-view/style/prosemirror.css";
import "katex/dist/katex.min.css";
import "prosemirror-gapcursor/style/gapcursor.css";
import './style.css'
import MyEditor from "./editor/math/MathEditor.tsx";
function App() {
  return <MyEditor/>
}

export default App

// File handling and other minor things
var file_name = "Untitled";
const file_name_container = "file-name";
const file_name_update = "change-file-name";

const init_setup = () => {
    let nodes = document.getElementsByClassName(file_name_container);
    for(let i=0; i<nodes.length; i++){
        nodes[i].innerHTML = file_name;
    }
    let root =  document.getElementById(file_name_update);
    let btn = root.getElementsByTagName("button")[0];
    // console.log(root, btn);
    btn.addEventListener('click', (e) => {
        let root =  document.getElementById(file_name_update);
        let name = root.getElementsByTagName("input")[0];
        // console.log(root, name);
        let fname = name.value;
        file_name = fname;
        let nodes = document.getElementsByClassName(file_name_container);
        for(let i=0; i<nodes.length; i++){
            nodes[i].innerHTML = file_name;
        }
    });
};

// ----------------------------------------------------------- //
// Jointjs window things
var namespace, graph, paper;
const WIDTH = 1000, HEIGHT = 600, DOM_ID = "root";

const init_window = () => {
    namespace = joint.shapes;
    graph = new joint.dia.Graph({}, { cellNamespace: namespace });
    paper = new joint.dia.Paper({
        el: document.getElementById(DOM_ID),
        model: graph,
        width: WIDTH,
        height: HEIGHT,
        gridSize: 1,
        cellViewNamespace: namespace
    });
};

const main = () => {
    console.log("Hello world");
    init_setup();
    init_window();
};

window.addEventListener('load', (e) => {
    main();
});
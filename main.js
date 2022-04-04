// import { Component, Module } from "./component";


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
        name.value = "";
    });
};

// ----------------------------------------------------------- //
// Jointjs window things
var namespace, graph, paper;
const WIDTH = 1000, HEIGHT = 600, DOM_ID = "root";

var _ID = 0, last_selected = -1;

const get_uid = () => { _ID += 1; return _ID; }
var id2comp = new Map();
var id2class = new Map();
var jointId2id = new Map();

const make_rect = (comp) => {
    let posx = comp.pos[0], posy = comp.pos[1];
    let L = comp.dim[0], W = comp.dim[1];
    
    let rect = new joint.shapes.standard.Rectangle();
    rect.position(posx, posy);
    rect.resize(L, W);
    rect.attr({
        body: {
            fill: comp.fillColor
        },
        label: {
            text: comp.label,
            fill: comp.color
        }
    });
    return rect;
};

const make_component = (comp) => {
    console.log(comp.display());
    var obj = null;
    if(comp.type == TYPE_BOX){
        obj = make_rect(comp);
    }
    else if(comp.type == TYPE_LINK){

    }
    return obj;
};

const addComponent = (e) => {
    let tt = e.target.name;
    console.log("Somebody clicked me! ", tt);
    if(tt == "module"){
        let id = get_uid();
        comp = make_component(new Module(id, "Box spawned!"));
        jointId2id[comp.id] = id;
        id2comp[id] = comp;
        id2class[id] = new Module(id, "Box spawned!");
        id2comp[id].addTo(graph);
    }
    else if(tt == "library" ){
        let id = get_uid();
        let comp = make_component(new Library(id, "Library spawned!"));
        jointId2id[comp.id] = id;
        id2comp[id] = comp;
        id2class[id] = new Library(id, "Library spawned!");
        id2comp[id].addTo(graph);
    }
    else{
        alert("No such component available :(");
    }
};

const render_comp_details = (comp) => {
    let cid = comp.id;
    let pos = comp.position(), sz = comp.size();
    let id = jointId2id[cid];
    console.log(cid, id);
    console.log(comp.attr());
    id2class[id].display();
    document.getElementById("sc-id").innerHTML = `ID: ${id}`;
    document.getElementById("sc-pos").innerHTML = `Position: ${pos.x} ${pos.y}`;
    document.getElementById("sc-input-dim").value = `${sz.width} ${sz.height}`;
    document.getElementById("sc-input-txt").value = `${comp.attr().label.text}`;
    last_selected = id;
};

const reset_comp_details = () => {
    document.getElementById("sc-id").innerHTML = `ID: --`;
    document.getElementById("sc-pos").innerHTML = `Position: -- --`;
    document.getElementById("sc-input-dim").value = `-- --`;
    document.getElementById("sc-input-txt").value = ``;
};

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

    paper.on("element:contextmenu", (cellView, e, x, y) => {
        let comp = cellView.model;
        console.log("element:contextmenu : ", cellView, e, x, y);
        render_comp_details(comp);
    })
    paper.on("cell:contextmenu", (cellView, e, x, y) => {
        console.log("cell:contextmenu : ", cellView, e, x, y);
    })
    paper.on("blank:contextmenu", (cellView, e, x, y) => {
        console.log("blank:contextmenu : ", cellView, e, x, y);
    })
    paper.on("link:contextmenu", (cellView, e, x, y) => {
        console.log("link:contextmenu : ", cellView, e, x, y);
    })

    document.getElementById("sc-update").addEventListener("click", (e) => {
        let id = last_selected;
        if(id > 0){
            let dim = document.getElementById("sc-input-dim").value;
            let txt = document.getElementById("sc-input-txt").value;
            try{
                let dx = parseInt(dim.split(" ")[0]);
                let dy = parseInt(dim.split(" ")[1]);
                id2comp[id].resize(dx, dy);
            }
            catch(e){
                console.log(e);
                alert("Bad entry!!");
            }
            id2comp[id].attr("label/text", txt);
        }
        reset_comp_details();
    });
    document.getElementById("sc-delete").addEventListener("click", (e) => {
        console.log(last_selected);
        if(last_selected > 0){
            let id = last_selected;
            id2comp[id].remove();
        }
        reset_comp_details();
    });


    // binding component to button
    let nodes = document.getElementsByClassName("component");
    for(let i=0; i<nodes.length; i+=1){
        nodes[i].addEventListener("click", (e) => {
            addComponent(e);
        });
    }

    reset_comp_details();
};

const main = () => {
    console.log("Hello world");
    init_setup();
    init_window();
};

window.addEventListener('load', (e) => {
    main();
});
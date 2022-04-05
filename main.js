// import { Component, Module } from "./component";

// File handling and other minor things
var file_name = 'Untitled';
const file_name_container = 'file-name';
const file_name_update = 'change-file-name';
var loadedfjson = false;
const init_setup = () => {
  let nodes = document.getElementsByClassName(file_name_container);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].innerText = file_name;
  }
  let renamebtn = document.getElementById('rename-file');
  // console.log(root, btn);
  renamebtn.addEventListener('click', (e) => {
    let name = getfilename();
    if (name != null) {
      let nodes = document.getElementsByClassName(file_name_container);
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].innerText = name;
      }
    }
  });
};

function getfilename() {
  var name = prompt('Please enter file name', 'Untitled');
  if (name != null && name.trim() != '') {
    console.log(name);
    file_name = name;
    return name;
  } else {
    alert('Please enter a valid file name');
    return null;
  }
}
// ----------------------------------------------------------- //
// Jointjs window things
var namespace, graph, paper;
const WIDTH = 1000,
  HEIGHT = 600,
  DOM_ID = 'root';

var _ID = 0,
  last_selected = -1;

const get_uid = () => {
  _ID += 1;
  return _ID;
};
var id2comp = new Map();
var id2class = new Map();
var jointId2id = new Map();

const make_rect = (comp) => {
  let posx = comp.pos[0],
    posy = comp.pos[1];
  let L = comp.dim[0],
    W = comp.dim[1];

  let rect = new joint.shapes.standard.Rectangle();
  rect.position(posx, posy);
  rect.resize(L, W);
  rect.attr({
    body: {
      fill: comp.fillColor,
    },
    label: {
      text: comp.label,
      fill: comp.color,
    },
  });
  return rect;
};

const make_link = (comp) => {
  console.log('make_link ');
  comp.display();
  var link = new joint.shapes.standard.Link();
  link.source(comp.src);
  link.target(comp.tar);
  link.attr({
    line: {
      stroke: comp.color,
      strokeWidth: comp.strokeWidth,
    },
  });
  link.labels([
    {
      attrs: {
        text: {
          text: comp.label,
        },
      },
    },
  ]);
  return link;
};

const make_component = (comp) => {
  console.log(comp.display());
  var obj = null;
  if (comp.type == TYPE_BOX) {
    obj = make_rect(comp);
  } else if (comp.type == TYPE_LINK) {
    obj = make_link(comp);
  } else {
    alert('No such Component available yet.');
  }
  return obj;
};

const addComponent = (e) => {
  let tt = e.target.name;
  console.log('Somebody clicked me! ', tt);
  if (tt == 'module') {
    let id = get_uid();
    comp = make_component(new Module(id, 'Box spawned!'));
    jointId2id[comp.id] = id;
    id2comp[id] = comp;
    id2class[id] = new Module(id, 'Box spawned!');
    id2comp[id].addTo(graph);
  } else if (tt == 'library') {
    let id = get_uid();
    let comp = make_component(new Library(id, 'Library spawned!'));
    jointId2id[comp.id] = id;
    id2comp[id] = comp;
    id2class[id] = new Library(id, 'Library spawned!');
    id2comp[id].addTo(graph);
  } else if (tt == 'control-flow') {
    let id = get_uid();
    let comp = make_component(new ControlFlow(id, 'None'));
    jointId2id[comp.id] = id;
    id2comp[id] = comp;
    id2class[id] = new ControlFlow(id, 'None');
    id2comp[id].addTo(graph);
  } else if (tt == 'data-flow') {
    let id = get_uid();
    let comp = make_component(new DataFlow(id, 'Data'));
    jointId2id[comp.id] = id;
    id2comp[id] = comp;
    id2class[id] = new DataFlow(id, 'Data');
    id2comp[id].addTo(graph);
  } else {
    alert('No such component available :(');
  }
};

const render_comp_details = (comp) => {
  console.log(comp);
  let cid = comp.id;
  let pos = comp.position(),
    sz =
      comp.attributes.type == 'standard.Rectangle'
        ? comp.size()
        : { width: '--', height: '--' };

  let id = jointId2id[cid];
  console.log(cid, id);
  console.log(comp.attr());
  id2class[id].display();
  document.getElementById('sc-id').innerHTML = `ID: ${id}`;
  document.getElementById('sc-pos').innerHTML = `Position: ${pos.x} ${pos.y}`;
  document.getElementById('sc-input-dim').value = `${sz.width} ${sz.height}`;
  if (comp.attributes.type == 'standard.Rectangle')
    document.getElementById('sc-input-txt').value = `${comp.attr().label.text}`;
  else
    document.getElementById('sc-input-txt').value = `${
      comp.labels()[0].attrs.text.text
    }`;

  if (comp.attributes.type == 'standard.Link') {
    let a = '',
      b = '';
    console.log(comp.source());
    console.log(comp.source().id);
    if (comp.source().id) {
      a = `${jointId2id[comp.source().id]}`;
    } else {
      let p = comp.source();
      a = `(${p.x},${p.y})`;
    }
    if (comp.target().id) {
      b = `${jointId2id[comp.target().id]}`;
    } else {
      let p = comp.target();
      b = `(${p.x},${p.y})`;
    }
    document.getElementById('sc-input-src-tar').value = `${a} ${b}`;
  }
  last_selected = id;
};

const reset_comp_details = () => {
  document.getElementById('sc-id').innerHTML = `ID: --`;
  document.getElementById('sc-pos').innerHTML = `Position: -- --`;
  document.getElementById('sc-input-dim').value = ``;
  document.getElementById('sc-input-txt').value = ``;
  document.getElementById('sc-input-src-tar').value = ``;
};

const init_window = () => {
  namespace = joint.shapes;
  graph = new joint.dia.Graph({}, { cellNamespace: namespace });
  paper = new joint.dia.Paper({
    el: document.getElementById(DOM_ID),
    model: graph,
    width: WIDTH,
    height: HEIGHT,
    gridSize: 10,
    drawGrid: true,
    cellViewNamespace: namespace,
  });

  paper.on('element:contextmenu', (cellView, e, x, y) => {
    let comp = cellView.model;
    console.log('element:contextmenu : ', cellView, e, x, y);
    render_comp_details(comp);
  });
  paper.on('cell:contextmenu', (cellView, e, x, y) => {
    console.log('cell:contextmenu : ', cellView, e, x, y);
    console.log(cellView.model);
    render_comp_details(cellView.model);
  });
  paper.on('blank:contextmenu', (cellView, e, x, y) => {
    console.log('blank:contextmenu : ', cellView, e, x, y);
  });
  paper.on('link:contextmenu', (cellView, e, x, y) => {
    console.log('link:contextmenu : ', cellView, e, x, y);
  });

  document.getElementById('sc-update').addEventListener('click', (e) => {
    let id = last_selected;
    let comp = id2comp[id];

    if (id > 0) {
      let dim = document.getElementById('sc-input-dim').value;
      let txt = document.getElementById('sc-input-txt').value;

      if (comp.attributes.type == 'standard.Link') {
        let link = document.getElementById('sc-input-src-tar').value;
        console.log('Link ', link);
        try {
          let sid = link.split(' ')[0];
          let tid = link.split(' ')[1];
          if (sid[0] == '(') {
            console.log(sid, tid);
            sid = sid.slice(1, -1);
            tid = tid.slice(1, -1);
            console.log(sid, tid);
            let s = {
              x: parseInt(sid.split(',')[0]),
              y: parseInt(sid.split(',')[1]),
            };
            let e = {
              x: parseInt(tid.split(',')[0]),
              y: parseInt(tid.split(',')[1]),
            };
            console.log(s, e);
            id2comp[id].source(s);
            id2comp[id].target(e);
          } else if (sid > 0 && tid > 0) {
            id2comp[id].source(id2comp[sid]);
            id2comp[id].target(id2comp[tid]);
          }
          id2comp[id].label(0, {
            attrs: {
              text: {
                text: txt,
              },
            },
          });
        } catch (e) {
          console.log(e);
          alert('Bad entry! :(');
        }
      } else {
        console.log('Rect');
        try {
          let dx = parseInt(dim.split(' ')[0]);
          let dy = parseInt(dim.split(' ')[1]);
          id2comp[id].resize(dx, dy);
        } catch (e) {
          console.log(e);
          alert('Bad entry!!');
        }
        id2comp[id].attr('label/text', txt);
      }

      // link part --
      /*
            let link = document.getElementById("sc-input-src-tar").value;
            try{
                let sid = parseInt(link.split(" ")[0]);
                let tid = parseInt(link.split(" ")[1]);
                if(sid > 0 && tid > 0){
                    id2comp[id].source(id2comp[sid]);
                    id2comp[id].target(id2comp[tid]);
                }
            }
            catch(e){
                console.log(e);
                alert("Bad entry! :(");

            }
            */
    }
    reset_comp_details();
  });
  document.getElementById('sc-delete').addEventListener('click', (e) => {
    console.log(last_selected);
    if (last_selected > 0) {
      let id = last_selected;
      id2comp[id].remove();
    }
    reset_comp_details();
  });

  // binding component to button
  let nodes = document.getElementsByClassName('component');
  for (let i = 0; i < nodes.length; i += 1) {
    nodes[i].addEventListener('click', (e) => {
      addComponent(e);
    });
  }

  reset_comp_details();
};

const main = () => {
  console.log('Hello world');
  init_setup();
  init_window();
};

window.addEventListener('load', (e) => {
  main();
});

//easy save and load functions - by utshomax

function loadFile() {
  $('#fileinput').trigger('click');
}
$('#fileinput').on('change', function (e) {
  let filen = e.target.files[0].name;
  var input, file, fr;
  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('fileinput');
  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  } else if (!input.files) {
    alert(
      "This browser doesn't seem to support the `files` property of file inputs."
    );
  } else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  } else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
  }

  function receivedText(e) {
    let lines = e.target.result;
    var newArr = JSON.parse(lines);
    graph.fromJSON(newArr);
  }
  let nodes = document.getElementsByClassName(file_name_container);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].innerHTML = filen.split('.')[0];
  }
});

function save_file() {
  let data = JSON.stringify(graph.toJSON());
  let blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${file_name}.json`);
}

const TYPE_LINK = "LINK", TYPE_BOX = "BOX_COMP", TYPE_TEXT = "TEXT";

class Component{
    constructor(id, type){
        this.id = id;
        this.type = type;
    }
    display(){
        console.log("Component, id:", this.id, " type:", this.type);
    }
};

class Module extends Component{
    constructor(id, label){
        super(id, TYPE_BOX);
        this.label = label;
        this.pos = [WIDTH/2, HEIGHT/2]
        this.dim = [150, 100]
        this.fillColor = "#e6be53";
        this.color = "#000000";
    }

    display(){
        super.display();
        console.log("Module | label:", this.label)
    }
};

class Library extends Component{
    constructor(id, label){
        super(id, TYPE_BOX);
        this.label = label;
        this.pos = [WIDTH/2, HEIGHT/2]
        this.dim = [180, 100]
        this.fillColor = "#9ae653";
        this.color = "#000000";
    }
    display(){
        super.display();
        console.log("Library | label:", this.label)
    }
};

class ControlFlow extends Component{
    constructor(id, label){
        super(id, TYPE_LINK);
        this.src = {x : WIDTH/2, y : HEIGHT/2};
        this.tar = {x : this.src.x + 100, y : this.src.y};
        this.color = "#3152e8";
        this.strokeWidth = 3;
        this.label = null;
    }
    display(){
        super.display();
        console.log("Link Control Flow | label: ", this.label, this.src, this.tar);
    }
};

class DataFlow extends Component{
    constructor(id, label){
        super(id, TYPE_LINK);
        this.src = {x : WIDTH/2, y : HEIGHT/2 + 20};
        this.tar = {x : this.src.x + 80, y : this.src.y};
        this.color = "#000000";
        this.strokeWidth = 1;
        this.label = label;
    }
    display(){
        super.display();
        console.log("Link Data Flow | label: ", this.label);
    }
};

// export{
//     Component, Module
// }
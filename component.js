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
        console.log("Module | label:", this.label)
    }
};

class ControlFlow extends Component{
    constructor(id, label){
        super(id);
    }
};

// export{
//     Component, Module
// }
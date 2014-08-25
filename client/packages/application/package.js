module.exports = {
    use_app_layout: true,
    pages: ["*"],
    models: ["*"],
    middleware: [
    	function(){}
    ],
    routes: [
        {
        	route: "",
        	page:"home",
	        callback: "home"
        },
        {
		    route: "/editor",
	        page: "editor",
	        callback: "editor"
		},
		{
		    route: "/olymp",
	        page: "olymp",
	        callback: "olymp"
		},
		{
		    route: "/timetable",
	        page: "timetable",
	        callback: "timetable"
		},
		{
		    route: "/login",
	        page: "login"
		},
		{
		    route: "/cabinet",
	        page: "admin",
	        callback: "cabinet"
		},
		{
			route: "/admin",
			"package": "MUON:admin"
		},
		{
		    route: "*a",
	        page: "error"
		}
    ],
    ready: function(next){
    	 m.Collection.extend({url: "/apis/source",model: m.models["source"]});
    	 m.Collection.extend({url: "/apis/user",model: m.models["user"]});
    	// this.m.set_projection("useermodel",m.model_user("asdf"));
    	next();
    },
    surrogate: {
    	"switch_nav_tab": function(id){
    		$('.nav_tab').removeClass("selected");
        	$('.nav_tab#'+id).addClass("selected");
    	},
    	"home": function(){	//this. - surrogate
    		this.switch_nav_tab("home");
    	},
    	"olymp": function(){
    		this.switch_nav_tab("olymp");
    	},
    	"editor": function(){
    		this.switch_nav_tab("editor");
    	},
    	"timetable": function(){
    		this.switch_nav_tab("timetable");
    		var model = m.model_source("524d3066761c4f060c000001");
    		this.m.setProjection("sss", model);
    		model.fetch();
    	},
    	"cabinet": function(){
    		this.switch_nav_tab("cabinet");
    	}
    },
    dictionary:{
    	
    }
}

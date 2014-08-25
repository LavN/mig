m.ModelView.extend({
	rendered: function(){
		// this.listenTo(this.context, 'destroy', this.remove);
		var cts = this.context.get("categories");
		for (var i in cts){
			$("<li class='menu-list-item'><a data-route=''>"+cts[i].name+"</a></li>").appendTo(this.$('ul#categories'));
		}
		this.setCategory('info');
		
	},
	renderBlock:function(){
		this.$("#content_container").append("<p>lolo</p>");
	},
	setCategory:function(key){
		// if("string" != typeof key) return;
		if(this.context.get("categories")[key]){
			this.renderBlock();
		}
	}
})
// 52692768cdbc168008000001
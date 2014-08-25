m.EditLayoutView = m.LayoutView.extend({
	rendered: function($el){
		console.log("rendered");
		this.$el.find("[data-model-view]").each(function(el){
			console.log(el)
			var bar = $("<p>change delete hide new</p>");
			bar.attr("id",$(el).id)
			$(el).append()
		});
		var _=this;
	}
})

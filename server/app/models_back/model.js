module.exports = {
	attrs: {
		firstAttr: {
			type: "string",
			defaults: "none",
			nullAllowed: false			
		},
		secondAttr: {
			type: "number",
			defaults: 0,
			nullAllowed: true
		},
		thirdAttr: {
			type: "[number]",
			defaults: [0,1,2,3],
			nullAllowed: true
		},
		forthAttr: {
			type: "[object]",
			defaults: null
		}
	}
}

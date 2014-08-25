module.exports={
	attrs:{
		"NullString":{
			type: "string",
			nullAllowed: true,
			defaults: null
		},
		"NullNumber":{
			type: "number",
			nullAllowed: true,
			defaults: null
		},
		"NullArray":{
			type: "[string]",
			nullAllowed: true,
			defaults: null
		},
		"NullObject":{
			type: "object",
			nullAllowed: true,
			defaults: null
		},
		"NullModel":{
			type: "subject",
			nullAllowed: true,
			defaults: null
		},
		"Model":{
			type: "source",
			nullAllowed: false,
			defaults: "528a230f4aa1aafc10000002"
		},
		"EmptyModelArray":{
			type: "[subject]",
			nullAllowed: false,
			defaults:["516d3f48adf284d029000002", "516d3fccadf284d029000007"]
		},
		"String":{
			type: "string",
			nullAllowed: true,
			defaults:"lolo"
		},
		"StringArray":{
			type: "[string]",
			nullAllowed: true,
			defaults:["lolo string0","trololo string1", "lololo string2"]
		},
		"EmptyStringArray":{
			type: "[string]",
			nullAllowed: true,
			defaults:[]
		},
		"Number":{
			type: "number",
			nullAllowed: true,
			defaults:25
		},
		"NumberArray":{
			type: "[number]",
			nullAllowed: true,
			defaults:[45,666, 78]
		},
		"Date":{
			type: "date",
			nullAllowed: true,
			defaults:"12.03.05"
		},
		"DateArray":{
			type: "[date]",
			nullAllowed: true,
			defaults:["12.03.05"]
		},
		"Object":{
			type: "object",
			nullAllowed: true,
			defaults:{view:"source",obj:"id",block:{key:"lolo",key2:{sub:"6767"}}}
		},
		"Emptyobject":{
			type: "object",
			nullAllowed: false,
			defaults:{}
		},
		"ObjectArray":{
			type: "[object]",
			nullAllowed: true,
			defaults:[{"obj11":"11"},{"obj21":"sdfsdf"}]
		}
	}
}

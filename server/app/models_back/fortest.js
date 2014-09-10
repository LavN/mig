module.exports={
	attributes:{
		"at1":{
			type: "text",
			required: false,
			defaultValue:"value1"
		},
		"at2":{
			type: "text",
			required: false,
			defaultValue:"value2"
		},
		// "at3":{
            // type: "text",
            // required: false,
            // defaultValue:"value3"
        // },
    },
    hasOne:{
        "one": "subject"
    },
    hasMany:{
        "many": "lolo"
    }
};

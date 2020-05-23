       
console.log("from crap file");

let allrows = [];

fields.forEach(field => {  

    let bytagrow = {
        tag_name: tagname,
        tag_id: thetagID,
        allowed_field: JSON.stringify(field.data.attributes.name),
        switch: false,
    }

    allrows.push(bytagrow);

    //this.makeRow(bytagrow);

});





let sortFields = []

var i = 0;
fields.forEach(field => {  
    let bytagrow = {
            tag_name: tagname,
            tag_id: thetagID,
            allowed_field: JSON.stringify(field.data.attributes.name),
            switch: false,
        }
    // this.matchingTag = app.store.createRecord('raafirivero-mason-bytag',{
    //     attributes: bytagrow
    // });
    //this.makeRow(bytagrow); 
    sortFields.push(bytagrow);

})








   // hasData(fields,result) {

    //     // create new database entries per tag if they don't exist
    //     // NEED TO: make this re-run for all new tags added to the database
    //     this.myStorage = app.store.all('raafirivero-mason-bytag');

    //     // convert to strings for API call
    //     let tagname = this.tag;
    //     let thetagID = this.tagID;

    //     //let matchingTag = this.myStorage.filter(match => match.data.attributes.tag_name == this.tag);
    //     this.matchingTag = this.myStorage.filter(match => match.data.attributes.tag_name == this.tag);
    //     ///this.buildSwitches();

    //     //console.log(fields);


    //     // if a tag has just been created, make its rows in the database
    //     if (this.matchingTag == false) {

    //         var i = 0;
    //         fields.forEach(field => {  
    //             let bytagrow = {
    //                     tag_name: tagname,
    //                     tag_id: thetagID,
    //                     allowed_field: JSON.stringify(field.data.attributes.name),
    //                     switch: false,
    //                 }
    //             this.tag = app.store.createRecord('raafirivero-mason-bytag',{
    //                 attributes:bytagrow
    //             });
    //             this.makeRow(bytagrow); 
    //         })
    //         i++; 



    //     } else { 
    //         // already established rows
    //         this.buildSwitches()
    //     }

    // }







    saveField(count) {
        this.processing = true;

        this.save(this.matchingTag[count]).then(() => {

            this.processing = false;
            this.dirty = false;

            //m.redraw();
        }).then(
            this.reInit(count)
        ).catch(err => {
            this.processing = false;

            throw err;
        })
        //return

    }




            // sortByAttribute(fields)
            //     .forEach(field => {  
            //     this.tag = app.store.createRecord('raafirivero-mason-bytag', {
            //         attributes: {
            //             tag_name: tagname,
            //             tag_id: thetagID,
            //             allowed_field: JSON.stringify(field.data.attributes.name),
            //             switch: false,
            //         },
            //     })
            //     //this.saveField();
            // });
            // this.tag = app.store.createRecord('raafirivero-mason-bytag', {fields});
            //console.log(fields);

       // associate the matching db row with the tag
        // can do better using result from above
        // this.myStorage = app.store.all('raafirivero-mason-bytag');
        // var mydb = this.myStorage;

        // for ( var i = 0 ; i < mydb.length ; i++ ) {
            // if (mydb[i].data.attributes.tag_name == this.tag ) {
                // this.dataRow = mydb[i].data;   

                // make an array
                //let slimlist = JSON.parse(mydb[i].data.attributes.allowed_field);
                //this.dataFields = slimlist;

                // this.dataField = [mydb[i].data.attributes.allowed_field];
            // }    

            // this won't work because we need to make it work under the fields sort function - or to iterate through
            // fields. But this is the right idea: 
            //if (mydb[i].data.attributes.tag_name == this.tag || mydb[i].data.attributes.allowed_field = field.data.attributes.name )
        }


    // isInDb(fieldName) {
    //         // console.log("is in db? " + this.dataFields);
    //         if(this.dataFields.includes(fieldName)) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    // }
 
    // setTagRelationship(fieldName, field) {
        

    //     let flipVal = this.isInDb(fieldName);
    //     //console.log(flipVal);

    //     if(flipVal) {
    //         // figure out how to remove items !
    //         return;
    //     } else {
    //         let jfieldName = JSON.stringify(fieldName);
    //         this.updateField(jfieldName, fieldName);
            
    //     }

    //     flipVal = !flipVal;
    //     //return(flipVal);
    //     //return this.isInDb(fieldName); 

    // }


        // /**
    //  * Updates setting in database.
    //  * @param prop
    //  * @param setting
    //  * @param value
    //  */
    // updateSetting(prop, setting, value) {
    //     saveSettings({
    //         [setting]: value
    //     });

    //     prop(value)
    // }

    // // updateSetting(prop, setting, value) {
    // updateSetting(setting, prop, value) {
    //     console.log("prop: " + prop);
    //     console.log("setting: " + setting);
    //     console.log("value: " + value);
    //     // saveSettings({
    //     //     [setting]: value
    //     // });

    //     // prop(value)
    // }






    updateField(jsonfieldname, fieldName) {

        let origFields = this.dataFields;

        if (Array.isArray(origFields) == false) {

            addField.push(origFields,fieldName);
            //console.log(addField);
        };

        origFields.push(fieldName);
        let addField = origFields;
        // converting in a separate variable for encapsulation
        addField = JSON.stringify(addField);
        // console.log("stringified: " + addField);

        app.request({
            method: 'PATCH',
            url: app.forum.attribute('apiUrl') + '/raafirivero/mason/bytag/' + this.dataRow.id,
            data: {
                data: {
                    attributes: {
                        allowed_field: addField,
                    },
                },
            },
        }).then(result => {
            app.store.pushPayload(result);
            //console.log(this);
        });

        this.dirty = true;

        m.redraw();
        //return;

    }
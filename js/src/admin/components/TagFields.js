import app from 'flarum/app';
import icon from 'flarum/helpers/icon';
import sortByAttribute from './../../lib/helpers/sortByAttribute';
import saveSettings from "flarum/utils/saveSettings";
import Component from 'flarum/Component';
import Switch from 'flarum/components/Switch';

export default class TagFields extends Component {

    init() {

        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/raafirivero/mason/bytag',
        }).then(result => {
            app.store.pushPayload(result);
            m.redraw();
            this.hasData(fields,result);
        })

        this.tag = this.props.tag;
        this.tagID = this.props.tagid;
        this.dirty = false;
        this.processing = false;
        this.toggleFields = false;
        this.boarding = true;
        this.dataRow;

        // this setting will probably go
        this.addedToTag = false;
        
        const fields = app.store.all('raafirivero-mason-field');
        this.fieldsList = [];

    }

    hasData(fields,result) {
        
        // associate the matching db row with the tag
        this.myStorage = app.store.all('raafirivero-mason-bytag');
        var mydb = this.myStorage;
        //var mydb = result.data;
        // console.log(mydb);
        // console.log(result);

        for ( var i = 0 ; i < mydb.length ; i++ ) {
            if (mydb[i].data.attributes.tag_name == this.tag ) {
                this.dataRow = mydb[i].data;    
                this.dataFields = mydb[i].data.attributes.allowed_fields;            
            }    
        }

        // terse version
        // for ( var i = 0 ; i < mydb.length ; i++ ) {
        //     if (mydb[i].tag_name == this.tag ) {
        //         this.dataRow = mydb[i];    
        //         this.dataFields = mydb[i].allowed_fields; 
        //     }    
        // }

        sortByAttribute(fields)
            .forEach(field => {                
                this.fieldsList.push(m('.Form-group', [
            m('label', Switch.component({
                state: this.isInDb(this.tag,field.data.attributes.name),
                //onchange: this.isInDb.bind(this, this.tag,field.data.attributes.name),
                onchange: this.setTagRelationship.bind(this, field.data.attributes.name, field),
                children: field.data.attributes.name,
                })),
            ]))
        })

        // create new database entries per tag if they don't exist
        let preSaved = app.store.all('raafirivero-mason-bytag');
        if (preSaved[0] == undefined) {
            this.tag = app.store.createRecord('raafirivero-mason-bytag', {
                attributes: {
                    tag_name: this.tag,
                    tag_id: this.tagID,
                    allowed_fields: '',
                },
            });
            this.saveField();
        }

        this.boarding = false;
    }

    isInDb(tagName, fieldName) {
            if(this.dataFields.includes(JSON.stringify(fieldName))) {
                return true;
            } 
    }
 
    setTagRelationship(fieldName, field) {

        if(this.isInDb(fieldName)) {
            return;
        } else {
            let jfieldName = JSON.stringify(fieldName);
            //console.log (this.tag.data.attributes);
            console.log(this)
            //this.dataFields.push(fieldName);
            //this.saveField();

            // this.tag = app.store.createRecord('raafirivero-mason-bytag', {
            //     attributes: {
            //         allowed_fields: jfieldName,
            //     },
            // });



            this.updateAttribute('dataFields', jfieldName);
        }

        


    }


    saveField() {
        this.processing = true;

        this.tag.save(this.tag.data.attributes).then(() => {

            this.processing = false;
            this.dirty = false;

            m.redraw();
        }).catch(err => {
            this.processing = false;

            throw err;
        });
    }

    view() {

        return m('.Mason-Tags-Dropdown', [
            m('.Button.Button--block.Mason-Box-Header', {
            onclick: () => {
                this.toggleFields = !this.toggleFields;               
                },
            }, [
                    m('.Mason-Box-Header-Title', this.tag),
                    m('div', icon('fas fa-chevron-' + (this.toggleFields ? 'up' : 'down'))),
                ]),
            (this.toggleFields ? this.seeFields() : null),  
        ]);
    }

    seeFields() {
        return m('div', [
                this.fieldsList
            ]);
    }



    
    /**
     * Updates setting in database.
     * @param prop
     * @param setting
     * @param value
     */
    updateSetting(prop, setting, value) {
        saveSettings({
            [setting]: value
        });

        prop(value)
    }


    updateAttribute(attribute, value) {
        this.tag.updateAttributes({
            [attribute]: value,
        });

        this.dirty = true;
    }



    initNewField() {
        this.tag = app.store.createRecord('raafirivero-mason-bytag', {
            attributes: {
                tag_name: '',
                tag_id: '',
                allowed_fields: '',
            },
        });
    }

    oldTagRelationship(tagName, tagID, fieldName, state){
        // console.log(this);
        // 'this' is the full fields dropdown under a tag name

        this.processing = true;

        //const allowedFields = app.store.allowed_fields('raafirivero-mason-bytag');
        const bytaglist = app.store.all('raafirivero-mason-bytag');

        if ( bytaglist.length == 0 ) {
            
            console.log("taglist still 0");

            // if it's empty set the first item in the array
            let jfieldName = JSON.stringify(fieldName);

            this.tag = app.store.createRecord('raafirivero-mason-bytag', {
                attributes: {
                    tag_name: tagName,
                    tag_id: tagID,
                    allowed_fields: jfieldName,
                },
            });

        } else {
            // otherwise grab the array of fields listed
            console.log("taglist plus 1");
        }

        //this.saveField()
        //console.log(bytaglist);
        return true;    
    }

}
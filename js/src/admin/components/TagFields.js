import app from 'flarum/app';
import icon from 'flarum/helpers/icon';
import Component from 'flarum/Component';
import Switch from 'flarum/components/Switch';
import sortByAttribute from './../../lib/helpers/sortByAttribute';

export default class TagFields extends Component {

    init() {

        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/raafirivero/mason/bytag',
        }).then(result => {
            app.store.pushPayload(result);
            this.initRows(result)
        })

        this.tag = this.props.tag;
        this.tagID = this.props.tagid;
        this.dirty = false;
        this.processing = false;
        this.toggleFields = false;
        this.boarding = true;
        this.dataRow;
        this.fieldsList = [];

    }

    initRows(result) {
        
        // result is from the API call, switch to that if nec;
        let tempStorage = app.store.all('raafirivero-mason-bytag');
        const fields = app.store.all('raafirivero-mason-field');

        // convert to strings for API call
        let tagname = this.tag;
        let thetagID = this.tagID;

        // match each Tag with the rows in the database that contain its fields
        this.matchingTag = tempStorage.filter(match => match.data.attributes.tag_name == this.tag);
        // sort alphabetically
        this.matchingTag.sort(function (x, y) {
            let a = x.data.attributes.allowed_field.toUpperCase(),
                b = y.data.attributes.allowed_field.toUpperCase();
            return a == b ? 0 : a > b ? 1 : -1;
        });
        
        // if a Tag has just been created, make its rows in the database
        if (this.matchingTag == false) {

            var i = 0;
            sortByAttribute(fields)
            .forEach(field => {  
                let rec = app.store.createRecord('raafirivero-mason-bytag', {
                    attributes: {
                        tag_name: tagname,
                        tag_id: thetagID,
                        allowed_field: JSON.stringify(field.data.attributes.name),
                        switch: false,
                    },
                })
                i++; 
                this.matchingTag.push(rec);
                this.makeRow(rec.data.attributes, i);
            });

        } else {
            this.buildSwitches()
        }    

    }
 
    buildSwitches() {
        
        // array of on/off switches under each Tag
        this.matchingTag.forEach(field => {      

            let mySwitch = field.data.attributes.switch;
            let rowID = field.data.id;     

             this.fieldsList.push(m('.Form-group', [
         m('label', Switch.component({
             state: mySwitch,
             onchange: this.updateRow.bind(this, rowID),
             children: JSON.parse(field.data.attributes.allowed_field),
             })),
         ]))

        })

     m.redraw();
     this.boarding = false;
    }

    makeRow(attributes, count) {

        app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/raafirivero/mason/bytag',
            data: {
                data: {
                    attributes: attributes
                },
            },
        }).then(result => {
            app.store.pushPayload(result);
            this.reInit(count);
            return;
        });
    }

    updateRow(rownumber, switchstate, switchobj) {

        // switching the HTML element *before* the API call for apparent speed
        switchobj.props.state = switchstate;

        app.request({
            method: 'PATCH',
            url: app.forum.attribute('apiUrl') + '/raafirivero/mason/bytag/' + rownumber,
            data: {
                data: {
                    attributes: {
                        switch: switchstate,
                    },
                },
            },
        }).then(result => {
            app.store.pushPayload(result);
            // better to update HTML element here, but slower for the user
        });
    }

    reInit(num) {
        // re-initialize once all the rows are made per tag;
        if( app.store.all('raafirivero-mason-field').length == num ) {
            this.init();
        }
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

}
import app from 'flarum/app';
import icon from 'flarum/helpers/icon';
import Component from 'flarum/Component';
import Switch from 'flarum/components/Switch';
import sortByAttribute from './../../lib/helpers/sortByAttribute';

export default class TagFields extends Component {

    init() {

        app.store.find('raafirivero/mason/bytag', {sort: 'tag_name'}).then(console.log(this));
        // const byTags = app.store.all('raafirivero/mason/bytag');

        //console.log(byTags);

        //console.log(app.forum.attribute('apiUrl'));
        // app.request({
        //     method: 'GET',
        //     url: app.forum.attribute('apiUrl') + '/raafirivero/mason/bytag',
        // }).then(result => {
        //     app.store.pushPayload(result);
        //     this.hasData(fields,result);
        // })

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

    buildSwitches() {
        
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

     // m.redraw();
     this.boarding = false;
    }

    makeRow(attributes) {

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
            // better to update HTML element here, but slower
            //console.log(app.store);
            // this.init();
            //return;
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
            // better to update HTML element here, but slower
        });
    }



    // saveField(count) {
    //     this.processing = true;

    //     this.tag.save(this.tag.data.attributes).then(() => {

    //         this.processing = false;
    //         this.dirty = false;

    //         //m.redraw();
    //     }).then(
    //         this.reInit(count)
    //     ).catch(err => {
    //         this.processing = false;

    //         throw err;
    //     })
    //     //return

    // }

    reInit(num) {
        // console.log(num);
        // console.log(this);

        // if( num = 4 ) {
        //     console.log(this);
        // }
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
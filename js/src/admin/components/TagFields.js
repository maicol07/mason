import app from 'flarum/app';
import icon from 'flarum/helpers/icon';
import sortByAttribute from './../../lib/helpers/sortByAttribute';
import saveSettings from "flarum/utils/saveSettings";
import Component from 'flarum/Component';
import Switch from 'flarum/components/Switch';

export default class TagFields extends Component {

    init() {
        // console.log(app.data.settings);
        // console.log(app.store);

        this.tag = this.props.tag;
        this.dirty = false;
        this.processing = false;
        this.toggleFields = false;

        this.addedToTag = false;
        
        const fields = app.store.all('raafirivero-mason-field');
        this.fieldsList = [];

        // we want to turn the top function into something like the bottom one

        sortByAttribute(fields)
            .forEach(field => {
                // Build array of fields to show.
                this.fieldsList.push(m('.Form-group', [
            m('label', Switch.component({
                state: this.addedToTag,
                //onchange: this.updateSetting.bind(this, this.addedToTag, 'raafirivero.mason.by-tag'),
                onchange: this.setTagRelationship.bind(this, this.tag, field.data.attributes.name),
                children: field.data.attributes.name,
                })),
            ]))
        })
        // console.log(this.fieldsList);
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

    setTagRelationship(tagName,fieldName,state){
        // console.log(this);
        // 'this' is the full fields dropdown under a tag name

        //this.processing = true;

        //const allowedFields = app.store.allowed_fields('raafirivero-mason-bytag');
        const bytaglist = app.store.all('raafirivero-mason-bytag');

        if ( bytaglist.length == 0 ) {
            // if it's empty set the first item in the array
            // console.log("empty list");

            console.log("taglist still 0");

            this.tag = app.store.createRecord('raafirivero-mason-bytag', {
                attributes: {
                    tag_name: tagName,
                    tag_id: '',
                    allowed_fields: fieldName,
                },
            });

        } else {
            // otherwise grab the array of fields listed
            console.log("taglist plus 1");
        }

        this.saveField()
        //console.log(bytaglist);
        return true;    
    }

    saveField() {
        this.processing = true;

        console.log("inside saveField");
        // console.log(this);

        const createNewRecord = !this.tag.exists;

        console.log('create new record =' + createNewRecord);

        this.tag.save(this.tag.data.attributes).then(() => {
            console.log("start saving");
            if (createNewRecord) {
                this.initNewField();
                this.toggleFields = false;
            }

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



    // initNewTagRelationship() {
    //     this.tag = app.store.createRecord('raafirivero-mason-bytag', {
    //         attributes: {
    //             tag_name: '',
    //             tag_id: '',
    //             allowed_fields: '',
    //         },
    //     });
    // }



    
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

}
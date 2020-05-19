import app from 'flarum/app';
import icon from 'flarum/helpers/icon';
import sortByAttribute from './../../lib/helpers/sortByAttribute';
import TagFields from './TagFields';
import saveSettings from "flarum/utils/saveSettings";
import Component from 'flarum/Component';
import Select from 'flarum/components/Select';
import Switch from 'flarum/components/Switch';

export default class MasonSettings extends Component {
    init() {
        this.fieldsSectionTitle = m.prop(app.data.settings['raafirivero.mason.fields-section-title'] || '');
        this.columnCount = m.prop(app.data.settings['raafirivero.mason.column-count'] || 1);
        this.byTag = m.prop(app.data.settings['raafirivero.mason.by-tag'] > 0);
        this.labelsAsPlaceholders = m.prop(app.data.settings['raafirivero.mason.labels-as-placeholders'] > 0);
        this.fieldsInHero = m.prop(app.data.settings['raafirivero.mason.fields-in-hero'] > 0);
        this.hideEmptyFieldsSection = m.prop(app.data.settings['raafirivero.mason.hide-empty-fields-section'] > 0);
        this.tagsAsFields = m.prop(app.data.settings['raafirivero.mason.tags-as-fields'] > 0);
        this.tagsFieldName = m.prop(app.data.settings['raafirivero.mason.tags-field-name'] || '');

        this.columnOptions = {};

        for (let i = 1; i <= 3; i++) {
            this.columnOptions[i] = app.translator.trans('raafirivero-mason.admin.settings.n-columns', {count: i});
        }


    }




        // orig //
        m('.Form-group', [
            m('label', Switch.component({
                state: this.byTag(),
                onchange: this.updateSetting.bind(this, this.byTag, 'raafirivero.mason.by-tag'),
                children: app.translator.trans('raafirivero-mason.admin.settings.by-tag'),
            })),
        ]),



































        //var appdata = app.data.resources;

        // // list of fields
        // const fields = app.store.all('raafirivero-mason-field');
        // this.fieldsList = [];

        // sortByAttribute(fields)
        //     .forEach(field => {
        //         // Build array of fields to show.
        //         this.fieldsList.push(m('.js-field-data', {
        //             key: field.id(),
        //             'data-id': field.id(),
        //         }, field.data.attributes.name ));
        //     });


        // this.toggleFields = false;







    view() {

                // list of tags
                const tags = app.store.all('tags');
                this.tagNames = [];     
        
                for ( let i = 0; i < tags.length; i++){   
                    var tagName = tags[i].data.attributes.name;
                    var tagbox = 
                        m('.Button.Button--block.Mason-Box-Header', {
                            onclick: () => {
                                this.toggleFields = !this.toggleFields;
                                this.toggleFields ? this.seeFields() : null;
                            },
                                }, [
                            m('.Mason-Box-Header-Title', tagName),
                            m('div', icon('fas fa-chevron-' + (this.toggleFields ? 'up' : 'down'))),
                        ]);
        
                    this.tagNames.push(tagbox);           
                }


        return m('.Mason-Container', [
            m('.Form-group', [
                m('label', Switch.component({
                    state: this.byTag(),
                    onchange: this.updateSetting.bind(this, this.byTag, 'raafirivero.mason.by-tag'),
                    children: app.translator.trans('raafirivero-mason.admin.settings.by-tag'),
                })),
            ]),
            (this.byTag() ? m('.Form-group', [
                m('label', app.translator.trans('raafirivero-mason.admin.settings.by-tag-name')),
                //m('.Mason-Box--column',this.tagNames),
                m('.Mason-Box--column',TagFields),
            ]) : null),





        // // list of fields
        // const fields = app.store.all('raafirivero-mason-field');
        // this.fieldsList = [];

        // sortByAttribute(fields)
        //     .forEach(field => {
        //         // Build array of fields to show.
        //         this.fieldsList.push(m('.js-field-data', {
        //             key: field.id(),
        //             'data-id': field.id(),
        //         }, field.data.attributes.name ));
        //     });

        // return this.fieldsList;

        view() {

            // list of tags
            const tags = app.store.all('tags');
            let tagsList = [];    
            
            // sortByAttribute(tags)
            // .forEach(tag => {
            //     // Build array of tags to show.
            //     tagsList.push(m('.js-tag-data', {
            //         key: tag.data.attributes.name,
            //         // 'data-id': tag.id(),
            //     }, TagFields.component({
            //         tag,
            //     })));
            // });
    
            for ( let i = 0; i < tags.length; i++){   
                var tagName = tags[i].data.attributes.name;
    
                tagsList.push(m('.js-tag-data', {
                    key: tagName,
                    // 'data-id': tag.id(),
                }, TagFields.component({
                    i,
                })));
              
            }
    
            //console.log(tagsList);
    
            // for ( let i = 0; i < tags.length; i++){   
            //     var tagName = tags[i].data.attributes.name;
            //     var tagbox = 
            //         m('.Button.Button--block.Mason-Box-Header', {
            //             onclick: () => {
            //                 this.toggleFields = !this.toggleFields;
            //                 this.toggleFields ? this.seeFields() : null;
            //             },
            //                 }, [
            //             m('.Mason-Box-Header-Title', tagName),
            //             m('div', icon('fas fa-chevron-' + (this.toggleFields ? 'up' : 'down'))),
            //         ]);
    
            //     tagsList.push(tagbox);           
            // }
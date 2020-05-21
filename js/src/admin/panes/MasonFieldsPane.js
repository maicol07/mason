import app from 'flarum/app';
import Component from 'flarum/Component';
import FieldEdit from './../components/FieldEdit';
import sortByAttribute from './../../lib/helpers/sortByAttribute';
import sortable from 'html5sortable/dist/html5sortable.es.js';
import MasonSettings from './../components/MasonSettings';

export default class MasonFieldsPane extends Component {
    init() {
        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/raafirivero/mason/fields',
        }).then(result => {
            app.store.pushPayload(result);
            m.redraw();
        });
        // app.request({
        //     method: 'GET',
        //     url: app.forum.attribute('apiUrl') + '/raafirivero/mason/bytag',
        // }).then(result => {
        //     app.store.pushPayload(result);
        //     m.redraw();
        // });
    }

    config() {
        let self = this;

        sortable('.js-fields-container', {
            handle: '.js-field-handle',
            items: '.js-field-data',
        }).forEach(function(el){
            $(el).off('sortupdate').on('sortupdate', e => {
                const sorting = e.detail.destination.items
                    .map(item => {
                        return $(item).data('id');
                    });

                self.updateSort(sorting);
            });
        });
    }

    view() {
        const fields = app.store.all('raafirivero-mason-field');

        let fieldsList = [];

        sortByAttribute(fields)
            .forEach(field => {
                // Build array of fields to show.
                fieldsList.push(m('.js-field-data', {
                    key: field.id(),
                    'data-id': field.id(),
                }, FieldEdit.component({
                    field,
                })));
            });

        return m('.container', [
            m('h2', app.translator.trans('raafirivero-mason.admin.titles.settings')),
            MasonSettings.component(),
            
            m('h2', app.translator.trans('raafirivero-mason.admin.titles.fields')),
            m('.Mason-Container', [
                m('.js-fields-container', fieldsList),
                FieldEdit.component({
                    key: 'new',
                    field: null,
                }),
            ]),
            
        ]);
    }

    updateSort(sorting) {
        app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/raafirivero/mason/fields/order',
            data: {
                sort: sorting,
            },
        }).then(result => {
            // Update sort attributes
            app.store.pushPayload(result);
            m.redraw();
        });
    }
}

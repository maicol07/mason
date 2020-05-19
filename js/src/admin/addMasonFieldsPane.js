import {extend} from 'flarum/extend';
import app from 'flarum/app';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';
import MasonFieldsPane from './panes/MasonFieldsPane';

export default function () {
    // create the route
    app.routes['raafirivero-mason-fields'] = {
        path: '/mason',
        component: MasonFieldsPane.component(),
    };

    // bind the route we created to the three dots settings button
    app.extensionSettings['raafirivero-mason'] = () => m.route(app.route('raafirivero-mason-fields'));

    extend(AdminNav.prototype, 'items', items => {
        // add the Image Upload tab to the admin navigation menu
        items.add('raafirivero-mason-fields', AdminLinkButton.component({
            href: app.route('raafirivero-mason-fields'),
            icon: 'fas fa-dungeon',
            children: 'Mason Plus',
            description: app.translator.trans('raafirivero-mason.admin.menu.description'),
        }));
    });
}

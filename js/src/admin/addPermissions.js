import {extend} from 'flarum/extend';
import app from 'flarum/app';
import ItemList from 'flarum/utils/ItemList';
import PermissionGrid from 'flarum/components/PermissionGrid';

export default function () {
    extend(PermissionGrid.prototype, 'permissionItems', groups => {
        const items = new ItemList();

        items.add('see-own-fields', {
            icon: 'fas fa-eye',
            label: app.translator.trans('raafirivero-mason.admin.permissions.see-own-fields'),
            permission: 'raafirivero.mason.see-own-fields',
        });
        items.add('see-other-fields', {
            icon: 'fas fa-eye',
            label: app.translator.trans('raafirivero-mason.admin.permissions.see-other-fields'),
            permission: 'raafirivero.mason.see-other-fields',
            allowGuest: true,
        });
        items.add('fill-fields', {
            icon: 'fas fa-tasks',
            label: app.translator.trans('raafirivero-mason.admin.permissions.fill-fields'),
            permission: 'raafirivero.mason.fill-fields',
        });
        items.add('update-own-fields', {
            icon: 'fas fa-edit',
            label: app.translator.trans('raafirivero-mason.admin.permissions.update-own-fields'),
            permission: 'raafirivero.mason.update-own-fields',
        });
        items.add('update-other-fields', {
            icon: 'fas fa-edit',
            label: app.translator.trans('raafirivero-mason.admin.permissions.update-other-fields'),
            permission: 'raafirivero.mason.update-other-fields',
            allowGuest: true,
        });
        items.add('skip-required-fields', {
            icon: 'fas fa-forward',
            label: app.translator.trans('raafirivero-mason.admin.permissions.skip-required-fields'),
            permission: 'raafirivero.mason.skip-required-fields',
        });

        groups.add('raafirivero-mason', {
            label: app.translator.trans('raafirivero-mason.admin.permissions.mason-heading'),
            children: items.toArray(),
        });
    });
}

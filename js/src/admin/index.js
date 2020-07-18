import app from 'flarum/app';
import Answer from './../lib/models/Answer';
import Field from './../lib/models/Field';
import ByTag from './../lib/models/ByTag';
import addMasonFieldsPane from './addMasonFieldsPane';
import addPermissions from './addPermissions';

app.initializers.add('raafirivero-mason', app => {
    app.store.models['raafirivero-mason-field'] = Field;
    app.store.models['raafirivero-mason-answer'] = Answer;
    app.store.models['raafirivero-mason-bytag'] = ByTag;

    addMasonFieldsPane();
    addPermissions();
});

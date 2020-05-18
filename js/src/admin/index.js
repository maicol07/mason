import app from 'flarum/app';
import Answer from './../lib/models/Answer';
import Field from './../lib/models/Field';
import addMasonFieldsPane from './addMasonFieldsPane';
import addPermissions from './addPermissions';

app.initializers.add('raafirivero-mason', app => {
    app.store.models['raafirivero-mason-field'] = Field;
    app.store.models['raafirivero-mason-answer'] = Answer;

    addMasonFieldsPane();
    addPermissions();
});

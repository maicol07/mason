import app from 'flarum/app';
import Model from 'flarum/Model';
import Discussion from 'flarum/models/Discussion';
import Forum from 'flarum/models/Forum';
import Answer from './../lib/models/Answer';
import Field from './../lib/models/Field';
import ByTag from './../lib/models/ByTag';
import addComposerFields from './addComposerFields';
import addFieldUpdateControl from './addFieldUpdateControl';
import addFieldsOnDiscussionHero from './addFieldsOnDiscussionHero';
import addFieldsOnDiscussionPost from './addFieldsOnDiscussionPost';
import patchModelIdentifier from "./patchModelIdentifier";

app.initializers.add('raafirivero-mason', app => {
    app.store.models['raafirivero-mason-field'] = Field;
    app.store.models['raafirivero-mason-answer'] = Answer;
    app.store.models['raafirivero-mason-bytag'] = ByTag;

    Discussion.prototype.raafiriveroMasonAnswers = Model.hasMany('raafiriveroMasonAnswers');
    Discussion.prototype.canSeeRaafiRiveroMasonAnswers = Model.attribute('canSeeRaafiRiveroMasonAnswers');
    Discussion.prototype.canUpdateRaafiRiveroMasonAnswers = Model.attribute('canUpdateRaafiRiveroMasonAnswers');
    Forum.prototype.canFillRaafiRiveroMasonFields = Model.attribute('canFillRaafiRiveroMasonFields');

    addComposerFields();
    addFieldsOnDiscussionHero();
    addFieldsOnDiscussionPost();
    addFieldUpdateControl();
    patchModelIdentifier();
});

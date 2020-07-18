import {extend} from 'flarum/extend';
import app from 'flarum/app';
import DiscussionComposer from 'flarum/components/DiscussionComposer';
import FieldsEditor from './components/FieldsEditor';

export default function () {
    DiscussionComposer.prototype.raafiriveroMasonAnswers = [];

    extend(DiscussionComposer.prototype, 'headerItems', function (items) {
        if (!app.forum.canFillRaafiRiveroMasonFields()) {
            return;
        }

        items.add('raafirivero-mason-fields', FieldsEditor.component({
            answers: this.raafiriveroMasonAnswers,
            onchange: answers => {
                this.raafiriveroMasonAnswers = answers;
            },
            ontagchange: tags => {
                this.tags = tags;
            },
        }));
    });

    extend(DiscussionComposer.prototype, 'data', function (data) {
        if (!app.forum.canFillRaafiRiveroMasonFields()) {
            return;
        }

        data.relationships = data.relationships || {};
        data.relationships.raafiriveroMasonAnswers = this.raafiriveroMasonAnswers;
    });
}

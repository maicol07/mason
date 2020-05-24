import {extend} from 'flarum/extend';
import app from 'flarum/app';
import DiscussionComposer from 'flarum/components/DiscussionComposer';
import FieldsEditor from './components/FieldsEditor';
// import ByTag from '../lib/models/ByTag';

export default function () {
    DiscussionComposer.prototype.raafiriveroMasonAnswers = [];
    let byTag = app.data.resources[0].attributes['raafirivero.mason.by-tag'];
    // console.log(app.data.resources);
    console.log(app.store);

    extend(DiscussionComposer.prototype, 'headerItems', function (items) {
        if (!app.forum.canFillRaafiRiveroMasonFields()) {
            return;
        }

        if(!byTag) {
            // turn off the fields completely if the main byTag setting is off
            items.add('raafirivero-mason-fields', FieldsEditor.component({
                answers: this.raafiriveroMasonAnswers,
                onchange: answers => {
                    this.raafiriveroMasonAnswers = answers;
                },
                ontagchange: tags => {
                    this.tags = tags;
                },
            }));
        } else {
            // logic here

            this.byTag = byTag;

            // items.add('raafirivero-mason-fields', FieldsEditor.component({
            //     answers: this.raafiriveroMasonAnswers,
            //     onchange: answers => {
            //         this.raafiriveroMasonAnswers = answers;
            //     },
            //     ontagchange: tags => {
            //         this.tags = tags;
            //     },
            // }));
        }
    });

    extend(DiscussionComposer.prototype, 'data', function (data) {
        if (!app.forum.canFillRaafiRiveroMasonFields()) {
            return;
        }
        
        //
        error_log(data);
        //

        data.relationships = data.relationships || {};
        data.relationships.raafiriveroMasonAnswers = this.raafiriveroMasonAnswers;
    });
}

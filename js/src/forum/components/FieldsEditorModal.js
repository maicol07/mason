import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import FieldsEditor from './FieldsEditor';
import FieldsEditorByTags from './FieldsEditorByTags';
import ByTagsComposer from './ByTagsComposer';

export default class FieldsEditorModal extends Modal {
    init() {
        super.init();

        this.answers = this.props.discussion.raafiriveroMasonAnswers();
        this.dirty = false;
        this.processing = false;
        this.tagRelationship = this.props.discussion.data.relationships.tags.data[0];

        // Stays null if the feature is not used
        this.tags = null;


        let ByTagsUnit = new ByTagsComposer;
        const matchingTags = ByTagsUnit.matchTags();
        this.myFields = [];

        // annoying way to get current Tag name, but it works
        let thisIncludes = this.props.discussion.payload.included;
        const findTag = thisIncludes.find(element => element.type == "tags")
        
        for (let i = 0; i < matchingTags.length; i++) {
            if (matchingTags[i].tagName == findTag.attributes.name) {
                this.myFields = matchingTags[i].fields;
            }
        }
    }

    title() {
        return app.translator.trans('raafirivero-mason.forum.answers-modal.edit-title', {
            title: m('em', this.props.discussion.title()),
        });
    }

    content() {
        return [
            m('.Modal-body', FieldsEditorByTags.component({
                discussion: this.props.discussion, // Only for the tags feature
                answers: this.answers,
                bytags: this.myFields,
                tags: this.tags,
                onchange: this.answersChanged.bind(this),
            })),
            // m('.Modal-body', FieldsEditor.component({
            //     discussion: this.props.discussion, // Only for the tags feature
            //     answers: this.answers,
            //     onchange: this.answersChanged.bind(this),
            //     ontagchange: tags => {
            //         this.tags = tags;
            //         this.dirty = true;
            //     },
            // })),
            m('.Modal-footer', [
                Button.component({
                    className: 'Button Button--primary',
                    children: app.translator.trans('raafirivero-mason.forum.answers-modal.save'),
                    loading: this.processing,
                    disabled: !this.dirty,
                    onclick: this.saveAnswers.bind(this),
                }),
            ]),
        ];
    }

    answersChanged(answers) {
        this.answers = answers;
        this.dirty = true;
    }

    saveAnswers() {
        this.processing = true;

        let tagRelationship = {
            data: this.tagRelationship,
        };

        let relationships = {
            tags: [tagRelationship],
            raafiriveroMasonAnswers: this.answers,
        };

        // If tag edit is enabled, take care of them here as well
        // if (this.tags !== null) {
        //     relationships.tags = this.tags;
        // }

        this.props.discussion.save({
            relationships,
        }).then(() => {
            this.processing = false;
            app.modal.close();
            m.redraw();
        }).catch(err => {
            this.processing = false;
            throw err;
        });
    }
}

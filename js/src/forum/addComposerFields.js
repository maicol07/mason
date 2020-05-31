import {extend, override} from 'flarum/extend';
import app from 'flarum/app';
import DiscussionComposer from 'flarum/components/DiscussionComposer';
import Composer from 'flarum/components/Composer';
import FieldsEditor from './components/FieldsEditor';
import FieldsEditorByTags from './components/FieldsEditorByTags';
import ByTagsComposer from './components/ByTagsComposer';
import TagDiscussionModal from 'flarum/tags/components/TagDiscussionModal';


export default function () {
    DiscussionComposer.prototype.raafiriveroMasonAnswers = [];
    let byTagEnabled = app.data.resources[0].attributes['raafirivero.mason.by-tag'];
    let ByTagsUnit = new ByTagsComposer;
    let dTag = '';
    var tagChanged = '';
    

    extend(TagDiscussionModal.prototype, 'onsubmit', function(e) {
        // get name of the tag selected in the modal

        if (this.selected == false) {
            // send a command to empty the field here
            dTag = '';      
            return;
        }

        dTag = this.selected[0].data.attributes.name;
    })

    extend(Composer.prototype, 'hide', function(e) {
        // remove the the fields from the headerItems...
        dTag = '';

    })


    extend(DiscussionComposer.prototype, 'headerItems', function(items) {
        if (!app.forum.canFillRaafiRiveroMasonFields()) {
            return;
        }

        this.fieldsByTags = [];

        // so this list contains whether a tag has fields!
        const matchingTags = ByTagsUnit.matchTags();

        if(byTagEnabled) {

            // fields selectively show up on byTag posts
            this.myFields = [];

            for (let i = 0; i < matchingTags.length; i++) {
                if (matchingTags[i].tagName == dTag) {
                    this.myFields = matchingTags[i].fields;
                }
            }
            // this.myFields is a list of only fields that match the selected tag


            if(tagChanged != dTag) {
                // clear the decks after every tag change
                this.raafiriveroMasonAnswers = [];             
                tagChanged = dTag;
            }
            

            this.fieldsByTags = FieldsEditorByTags.component({
                bytags: this.myFields,
                tags: this.tags,
                answers: this.raafiriveroMasonAnswers,
                onchange: answers => {
                    this.raafiriveroMasonAnswers = answers;
                },
            })

            items.add('raafirivero-mason-fields', this.fieldsByTags );
            
        } else {
            // show the fields on every post. (the original setup for the plugin)

            items.add('raafirivero-mason-fields', FieldsEditor.component({
                answers: this.raafiriveroMasonAnswers,
                onchange: answers => {
                    this.raafiriveroMasonAnswers = answers;
                },
                ontagchange: tags => {
                    this.tags = tags;
                },
            }));

        }
    });

    extend(DiscussionComposer.prototype, 'data', function (data) {
        if (!app.forum.canFillRaafiRiveroMasonFields()) {
            return;
        }

        data.relationships = data.relationships || {};
        data.relationships.raafiriveroMasonAnswers = this.raafiriveroMasonAnswers;

    });

}

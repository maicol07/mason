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
    

    extend(TagDiscussionModal.prototype, 'onsubmit', function(e) {
        // get name of the tag selected in the modal

        if (this.selected == false) {
            // send a command to empty the field here
            dTag = '';
            // DC.init();
            return;
        }

        dTag = this.selected[0].data.attributes.name;
    })

    extend(Composer.prototype, 'hide', function(e) {
        // remove the the fields from the headerItems...
        
    })


    extend(DiscussionComposer.prototype, 'headerItems', function (items) {
        if (!app.forum.canFillRaafiRiveroMasonFields()) {
            return;
        }

        // so this list contains whether a tag has fields!
        const matchingTags = ByTagsUnit.matchTags();

        if(byTagEnabled) {
            // fields selectively show up on byTag posts
            let myFields = [];

            for (let i = 0; i < matchingTags.length; i++) {
                if (matchingTags[i].tagName == dTag) {
                    myFields = matchingTags[i].fields;
                } 
            }      
            // myFields is a list of only fields that match the selected tag

            items.add('raafirivero-mason-fields', FieldsEditorByTags.component({
                    bytags: myFields,
                    answers: this.raafiriveroMasonAnswers,
                    onchange: answers => {
                        this.raafiriveroMasonAnswers = answers;
                    },
            }));
            
        } else {
            // console.log("the old way");
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

        // this sends only filled fields to the server
        data.relationships = data.relationships || {};
        data.relationships.raafiriveroMasonAnswers = this.raafiriveroMasonAnswers;

    });

    override(DiscussionComposer.prototype, 'onsubmit', function () {
        this.loading = true;

        const data = this.data();

        console.log(data);
    
        app.store
          .createRecord('discussions')
          .save(data)
          .then((discussion) => {
            app.composer.hide();
            app.cache.discussionList.refresh();
            m.route(app.route.discussion(discussion));
          }, this.loaded.bind(this));
    });
}

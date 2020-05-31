import app from 'flarum/app';
import icon from 'flarum/helpers/icon';
import ItemList from 'flarum/utils/ItemList';
import Component from 'flarum/Component';
import sortByAttribute from './../../lib/helpers/sortByAttribute';
import FieldEditDropdown from './FieldEditDropdown';
import FieldEditText from './FieldEditText';
import FieldEditTags from './FieldEditTags';
import FieldGrid from './FieldGrid';

export default class FieldsEditorByTags extends Component {
    init() {
        this.fields = sortByAttribute(app.store.all('raafirivero-mason-field'));

        // Index to quickly do a reverse lookup from answer to field
        this.answerToFieldIndex = [];
        this.fields.forEach(
            field => {
                field.suggested_answers().forEach(
                    answer => {
                        this.answerToFieldIndex[answer.id()] = field.id();
                    }
                );
            }
        );
    }

    view() {
        
        return m('form.Mason-Fields.Mason-Fields--editor', {
            onsubmit(event) {
                event.preventDefault();
            },
        }, [
            this.headItems().toArray(),
            FieldGrid.component({
                //items: this.fieldItems() // this.fieldItems().toArray(),
                items: this.fieldItems().toArray(),
            }),
        ]);
    }

    updateSelection(field, fieldAnswers) {
        // Keep only answers to other fields
        let answers = this.props.answers.filter(
            answer => {
                const reverseFieldLookup = this.answerToFieldIndex[answer.id()];

                // If the answer is not in the reverse lookup table it's probably a non-suggested (user) answer
                // In that case the field should be linked in the relationship
                if (typeof reverseFieldLookup === 'undefined') {
                    return answer.field().id() !== field.id();
                }

                return reverseFieldLookup !== field.id();
            }
        );

        answers = answers.concat(fieldAnswers);

        this.props.onchange(answers);
    }

    headItems() {
        const items = new ItemList();

        if (app.forum.attribute('raafirivero.mason.fields-section-title')) {
            items.add('title', m('h5.Mason-Field--title', app.forum.attribute('raafirivero.mason.fields-section-title')));
        }
        return items;
    }

    fieldItems() {
        const items = new ItemList();

        // taking this feature off beacuse changing tags will affect which fields show up

        // if (app.forum.attribute('raafirivero.mason.tags-as-fields')) {
        //     items.add('tags', FieldEditTags.component({
        //         discussion: this.props.discussion,
        //         onchange: tags => {
        //             if (this.props.ontagchange) {
        //                 this.props.ontagchange(tags);
        //             }
        //         },
        //     }));
        // }

        this.fields.forEach(field => {
            const inputAttrs = {
                field,
                bytags: this.props.bytags,
                inputid:field.data.id,
                answers: this.props.answers,
                onchange: fieldAnswers => {
                    // Every input component calls "onchange" with a list of answers from the store
                    this.updateSelection(field, fieldAnswers);
                },
            };
            let input = null;

            if (field.user_values_allowed()) {
                input = new FieldEditText(inputAttrs);
            } else {
                input = new FieldEditDropdown(inputAttrs);
            }

            this.props.bytags.forEach( tag => {
                // filter the items list for fields we actually need
                if ( tag == field.data.attributes.name ) {
                    items.add('field-' + field.id(), m('.Mason-Field.Form-group', {
                        className: app.forum.attribute('raafirivero.mason.labels-as-placeholders') ? 'Mason-Field--label-as-placeholder' : '',
                    }, [
                        m('label', [
                            (field.icon() ? [icon(field.icon()), ' '] : null),
                            field.name(),
                            (field.required() ? ' *' : null),
                        ]),
                        input,
                        (field.description() ? m('.helpText', field.description()) : null),
                    ]));
                }
            })
                
        });


        return items;
    }

    flush() {
        // console.log(this);
    }
}

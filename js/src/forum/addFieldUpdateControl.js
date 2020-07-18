import {extend} from 'flarum/extend';
import DiscussionControls from 'flarum/utils/DiscussionControls';
import Button from 'flarum/components/Button';
import FieldsEditorModal from './components/FieldsEditorModal';

export default function () {
    extend(DiscussionControls, 'moderationControls', function (items, discussion) {
        if (discussion.canUpdateRaafiRiveroMasonAnswers()) {
            items.add('raafirivero-mason-update-answers', Button.component({
                children: app.translator.trans('raafirivero-mason.forum.discussion-controls.edit-answers'),
                icon: 'fas fa-tag',
                onclick: () => app.modal.show(new FieldsEditorModal({discussion})),
            }));
        }
    });
}

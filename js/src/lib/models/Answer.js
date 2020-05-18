import app from 'flarum/app';
import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Answer extends mixin(Model, {
    content: Model.attribute('content'),
    is_suggested: Model.attribute('is_suggested'),
    sort: Model.attribute('sort'),
    field: Model.hasOne('field'),
}) {
    /**
     * @inheritDoc
     */
    apiEndpoint() {
        return '/raafirivero/mason/answers' + (this.exists ? '/' + this.data.id : '');
    }
}

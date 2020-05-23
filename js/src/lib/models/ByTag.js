import app from 'flarum/app';
import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class ByTag extends mixin(Model, {
    tag_name: Model.attribute('tag_name'),
    tag_id: Model.attribute('tag_id'),
    allowed_field: Model.attribute('allowed_field'),
    switch: Model.attribute('switch'),
    
}) {
    /**
     * @inheritDoc
     */
    apiEndpoint() {
        return '/raafirivero/mason/bytag' + (this.exists ? '/' + this.data.id : '');
    }
}

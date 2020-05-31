import app from 'flarum/app';
import Component from 'flarum/Component';

export default class FieldGrid extends Component {
    view() {
        let columnClass = "masoncol" + app.forum.attribute('raafirivero.mason.column-count');
        return m('.Mason-Grid-Wrapper', m('.Mason-Grid',{class:columnClass}, [
                this.props.items
            ])
        );
    }
}

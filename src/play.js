import * as tags from './tags';
import parseMd from './md';

export default function Play(md) {

  //let ast = parseMd(md);

  this.render = () => {
    let $wrap = tags.tag('cm-wrap')([
      
    ]);

    return $wrap;
  };

}

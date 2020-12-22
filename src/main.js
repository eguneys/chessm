import Play from './play';

export function app(element, options) {

  let play = new Play(options.md);

  let $_ = play.wrap();
  element.appendChild($_);

  play.render();
}

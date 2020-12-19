export function tag(name) {
  return (options, children) => {
    if (options.forEach) {
      children = options;
      options = {};
    }

    let $_ = document.createElement(name);

    if (options.cls) {
      
    }

    return $_;
  };
}

export const div = tag('div');
